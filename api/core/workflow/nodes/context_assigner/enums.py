from enum import StrEnum

class Operation(StrEnum):
    ADD = "add"
    CLEAR = "clear" 
    REMOVE = "remove"
    TRUNCATE = "truncate"


class WhichEnd(StrEnum):
    FIRST = "first"
    LAST = "last"

class Role(StrEnum):
    SYSTEM = "system"
    ASSISTANT = "assistant"
    USER = "user"

class AddHow(StrEnum):
    APPEND = "append"
    PREPEND = "prepend"
