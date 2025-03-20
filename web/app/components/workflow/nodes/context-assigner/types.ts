//import type { CommonNodeType, ValueSelector } from '@/app/components/workflow/types'
//
//export type OperationType = 'add' | 'clear' | 'remove' | 'truncate'
//export type RoleType = 'system' | 'assistant' | 'user'
//export type WhichType = 'first' | 'last'
//export type HowType = 'prepend' | 'append'
//
//export type ConversationManagerNodeType = CommonNodeType & {
//  conversation_variable: ValueSelector
//  operation: OperationType
//  role: RoleType
//  text: string
//  n?: number
//  which?: WhichType
//  how?: HowType
//  truncate_length?: number
//
//  context: {
//    enabled: boolean
//    variable_selector: ValueSelector
//  }
//}

import type { CommonNodeType, ValueSelector } from '@/app/components/workflow/types'

export type OperationType = 'add' | 'clear' | 'remove' | 'truncate'
export type RoleType = 'system' | 'assistant' | 'user'
export type WhichType = 'first' | 'last'
export type HowType = 'prepend' | 'append'

export type ConversationManagerNodeType = CommonNodeType & {
  conversation_variables: ValueSelector[]
  operation: OperationType
  role: RoleType
  text: string
  n?: number
  which?: WhichType
  how?: HowType
  truncate_length?: number

  context: {
    enabled: boolean
    variable_selector: ValueSelector
  }
}
