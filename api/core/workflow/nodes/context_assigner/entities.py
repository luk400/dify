from pydantic import Field
from typing import Optional
from core.workflow.nodes.base import BaseNodeData
from .enums import Operation, Role, WhichEnd, AddHow
from ..llm.entities import ContextConfig


class ContextAssignerNodeData(BaseNodeData):
    type: str = "context-assigner"
    context: ContextConfig = ContextConfig(enabled=False)
    conversation_variable: list[str]
    operation: Operation
    role: Optional[Role] = None  # Only needed for add operation
    how: Optional[AddHow] = None  # Only needed for add operation
    text: Optional[str] = None   # Only needed for add operation
    n: Optional[int] = Field(None, gt=0)  # For remove operation, must be > 0
    which: Optional[WhichEnd] = None  # For remove operation
    truncate_length: Optional[int] = Field(None, gt=0)  # For truncate operation, must be > 0
