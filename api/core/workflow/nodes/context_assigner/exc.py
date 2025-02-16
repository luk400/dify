from collections.abc import Sequence
from typing import Any

from core.workflow.nodes.context_assigner.common.exc import VariableOperatorNodeError

from .enums import Operation


class OperationNotSupportedError(VariableOperatorNodeError):
    def __init__(self, *, operation: Operation, variable_type: str):
        super().__init__(f"Operation {operation} is not supported for type {variable_type}")


class VariableNotFoundError(VariableOperatorNodeError):
    def __init__(self, *, variable_selector: Sequence[str]):
        super().__init__(f"Variable {variable_selector} not found")


class InvalidInputValueError(VariableOperatorNodeError):
    def __init__(self, *, value: Any):
        super().__init__(f"Invalid input value {value}")


class ConversationIDNotFoundError(VariableOperatorNodeError):
    def __init__(self):
        super().__init__("conversation_id not found")
