//import type { CommonNodeType, ValueSelector, VarType } from '@/app/components/workflow/types'
//
//export type VarGroupItem = {
//  output_type: VarType
//  variables: ValueSelector[]
//}
//export type ContextAssignerNodeType = CommonNodeType & VarGroupItem & {
//  advanced_settings: {
//    group_enabled: boolean
//    groups: ({
//      group_name: string
//      groupId: string
//    } & VarGroupItem)[]
//  }
//}
//

import type { CommonNodeType, ValueSelector, VarType } from '@/app/components/workflow/types'

export enum ContextAssignerOperation {
  Clear = 'clear',
  Append = 'append',
  Prepend = 'prepend'
}

export type ContextAssignerNodeType = CommonNodeType & {
  conversation_var: string
  operation: ContextAssignerOperation
  role?: string
  text?: string
}

export type VarGroupItem = {
  output_type: VarType
  variables: ValueSelector[]
}

