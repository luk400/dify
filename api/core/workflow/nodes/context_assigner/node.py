from typing import Any, cast
from core.variables import Variable
from core.workflow.constants import CONVERSATION_VARIABLE_NODE_ID
from core.workflow.entities.node_entities import NodeRunResult
from core.workflow.nodes.base import BaseNode
from core.workflow.nodes.enums import NodeType
from core.workflow.nodes.context_assigner.common import helpers as common_helpers
from core.model_manager import ModelManager, ModelType
from models.workflow import WorkflowNodeExecutionStatus

from .entities import ContextAssignerNodeData
from .enums import Operation, WhichEnd
from .exc import ConversationIDNotFoundError, VariableNotFoundError
from ..llm.node import LLMNode
from ..llm.entities import (
    LLMNodeChatModelMessage,
    ModelConfig
)
from core.workflow.nodes.event import (
    RunRetrieverResourceEvent,
)
from core.workflow.nodes.event import (
    RunRetrieverResourceEvent,
)
from core.model_runtime.entities.message_entities import (
    PromptMessageRole,
)


class HelperNode(BaseNode[ContextAssignerNodeData]):
    _node_data_cls = ContextAssignerNodeData

class ContextAssignerNode(LLMNode):
    _node_data_cls = ContextAssignerNodeData
    _node_type = NodeType.CONTEXT_ASSIGNER

    def __init__(self, *args, **kwargs):
        helper = HelperNode(*args, **kwargs)
        self.id = helper.id
        self.tenant_id = helper.tenant_id
        self.app_id = helper.app_id
        self.workflow_type = helper.workflow_type
        self.workflow_id = helper.workflow_id
        self.graph_config = helper.graph_config
        self.user_id = helper.user_id
        self.user_from = helper.user_from
        self.invoke_from = helper.invoke_from
        self.workflow_call_depth = helper.workflow_call_depth
        self.graph = helper.graph
        self.graph_runtime_state = helper.graph_runtime_state
        self.previous_node_id = helper.previous_node_id
        self.thread_pool_id = helper.thread_pool_id
        self.node_id = helper.node_id
        self.node_data = helper.node_data


    def _run(self) -> NodeRunResult:

        inputs = self.node_data.model_dump()
        #inputs = self.node_data.dict()  # Changed from model_dump to dict()
        process_data: dict[str, Any] = {}

        try:
            # Get the conversation variable
            conversation_var = self.graph_runtime_state.variable_pool.get(self.node_data.conversation_variable)
            if not isinstance(conversation_var, Variable):
                raise VariableNotFoundError(variable_selector=[self.node_data.conversation_variable[1]])

            # Get the current conversation array
            current_conversation = conversation_var.value if isinstance(conversation_var.value, list) else []

            # Apply the operation
            match self.node_data.operation:
                case Operation.ADD:
                    if not self.node_data.role or not self.node_data.text:
                        raise ValueError("Role and text are required for add operation")
                    
                    new_entry = {
                        "role": self.node_data.role,
                        "text": self.node_data.text,
                        "files": []  # Keep the files field for compatibility
                    }

                    prompt_template = []
                    if new_entry["role"] == "system":
                        prompt_template.append(LLMNodeChatModelMessage(text=new_entry["text"], role=PromptMessageRole.SYSTEM, edition_type="basic"))
                    elif new_entry["role"] == "user":
                        prompt_template.append(LLMNodeChatModelMessage(text=new_entry["text"], role=PromptMessageRole.USER, edition_type="basic"))
                    elif new_entry["role"] == "assistant":
                        prompt_template.append(LLMNodeChatModelMessage(text=new_entry["text"], role=PromptMessageRole.ASSISTANT, edition_type="basic"))

                    # fetch context value
                    generator = self._fetch_context(node_data=self.node_data)
                    context = None
                    for event in generator:
                        if isinstance(event, RunRetrieverResourceEvent) and context is None:
                            context = event.context
                        elif context is not None:
                            raise ValueError("Context already set")

                    
                    model_manager = ModelManager()
                    model_instance = model_manager.get_model_instance(
                        tenant_id=self.tenant_id, model_type=ModelType.LLM, provider="", model=""
                    )
                    _, dummy_model_config = self._fetch_model_config(ModelConfig(provider=model_instance.provider, name=model_instance.model, mode="chat", completion_params={}))
                    parsed, _ = self._fetch_prompt_messages(
                        sys_query=None,
                        sys_files=[],
                        context=context,
                        memory=None,
                        model_config=dummy_model_config,
                        prompt_template=prompt_template,
                        memory_config=None,
                        vision_enabled=False,
                        vision_detail=None,
                        variable_pool=self.graph_runtime_state.variable_pool,
                        jinja2_variables=None,
                    )

                    append = self.node_data.how == "append"

                    new_entry["text"] = parsed[0].content
                    updated_value = current_conversation + [new_entry] if append else [new_entry] + current_conversation

                case Operation.CLEAR:
                    updated_value = []

                case Operation.REMOVE:
                    if not self.node_data.n or not self.node_data.which:
                        raise ValueError("N and which are required for remove operation")
                    
                    n = min(self.node_data.n, len(current_conversation))  # Don't remove more than exists
                    
                    if self.node_data.which == WhichEnd.FIRST:
                        updated_value = current_conversation[n:]
                    else:  # LAST
                        updated_value = current_conversation[:-n]

                case Operation.TRUNCATE:
                    if not self.node_data.truncate_length:
                        raise ValueError("Truncate length is required for truncate operation")
                    
                    length = self.node_data.truncate_length
                    if len(current_conversation) > length:
                        # Keep the last 'length' entries
                        #updated_value = current_conversation[-length:]
                        # make sure to keep the first message if it is a system message
                        if current_conversation[0]["role"] == "system":
                            updated_value = [current_conversation[0]] + current_conversation[-length+1:]
                        else:
                            updated_value = current_conversation[-length:]
                    else:
                        updated_value = current_conversation

                case _:
                    raise ValueError(f"Unknown operation: {self.node_data.operation}")

            # Update the variable in the pool
            conversation_var = conversation_var.model_copy(update={"value": updated_value})
            #conversation_var = Variable( # instead of model_copy
            #    name=conversation_var.name,
            #    value_type=conversation_var.value_type,
            #    value=updated_value,
            #    selector=conversation_var.selector
            #)
            self.graph_runtime_state.variable_pool.add(conversation_var.selector, conversation_var)
            process_data[conversation_var.name] = conversation_var.value

            # Handle conversation variable updates if needed
            if conversation_var.selector[0] == CONVERSATION_VARIABLE_NODE_ID:
                conversation_id = self.graph_runtime_state.variable_pool.get(["sys", "conversation_id"])
                if not conversation_id:
                    raise ConversationIDNotFoundError()
                conversation_id = conversation_id.value
                common_helpers.update_conversation_variable(
                    conversation_id=cast(str, conversation_id),
                    variable=conversation_var,
                )

            return NodeRunResult(
                status=WorkflowNodeExecutionStatus.SUCCEEDED,
                inputs=inputs,
                process_data=process_data,
            )

        except (ValueError, VariableNotFoundError, ConversationIDNotFoundError) as e:
            return NodeRunResult(
                status=WorkflowNodeExecutionStatus.FAILED,
                inputs=inputs,
                process_data=process_data,
                error=str(e),
            )
