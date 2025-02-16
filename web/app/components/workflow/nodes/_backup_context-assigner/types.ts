import type { CommonNodeType, ValueSelector } from '@/app/components/workflow/types'

export type OperationType = 'add' | 'clear' | 'remove'
export type RoleType = 'system' | 'assistant' | 'user'
export type WhichType = 'first' | 'last'

export type ConversationManagerNodeType = CommonNodeType & {
  conversationVariable: ValueSelector
  operation: OperationType
  role: RoleType
  text: string
  n?: number
  which?: WhichType
}
