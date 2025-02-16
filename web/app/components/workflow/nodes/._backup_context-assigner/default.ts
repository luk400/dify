//import { type NodeDefault, VarType } from '../../types'
//import { BlockEnum } from '../../types'
//import type { ContextAssignerNodeType } from './types'
//import { ALL_CHAT_AVAILABLE_BLOCKS, ALL_COMPLETION_AVAILABLE_BLOCKS } from '@/app/components/workflow/constants'
//
//const i18nPrefix = 'workflow'
//
//const nodeDefault: NodeDefault<ContextAssignerNodeType> = {
//  defaultValue: {
//    output_type: VarType.any,
//    variables: [],
//  },
//  getAvailablePrevNodes(isChatMode: boolean) {
//    const nodes = isChatMode
//      ? ALL_CHAT_AVAILABLE_BLOCKS
//      : ALL_COMPLETION_AVAILABLE_BLOCKS.filter(type => type !== BlockEnum.End)
//    return nodes
//  },
//  getAvailableNextNodes(isChatMode: boolean) {
//    const nodes = isChatMode ? ALL_CHAT_AVAILABLE_BLOCKS : ALL_COMPLETION_AVAILABLE_BLOCKS
//    return nodes
//  },
//  checkValid(payload: ContextAssignerNodeType, t: any) {
//    let errorMessages = ''
//    const { variables } = payload
//    if (!variables || variables.length === 0)
//      errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.nodes.contextAssigner.title`) })
//    if (!errorMessages) {
//      variables.forEach((variable) => {
//        if (!variable || variable.length === 0)
//          errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.errorMsg.fields.variableValue`) })
//      })
//    }
//
//    return {
//      isValid: !errorMessages,
//      errorMessage: errorMessages,
//    }
//  },
//}
//
//export default nodeDefault

import { type NodeDefault } from '../../types'
import { BlockEnum } from '../../types'
import type { ContextAssignerNodeType } from './types'
import { ContextAssignerOperation } from './types'
import { ALL_CHAT_AVAILABLE_BLOCKS, ALL_COMPLETION_AVAILABLE_BLOCKS } from '@/app/components/workflow/constants'

const i18nPrefix = 'workflow'

const nodeDefault: NodeDefault<ContextAssignerNodeType> = {
  defaultValue: {
    conversation_var: '',
    operation: ContextAssignerOperation.Append,
  },
  getAvailablePrevNodes(isChatMode: boolean) {
    const nodes = isChatMode
      ? ALL_CHAT_AVAILABLE_BLOCKS
      : ALL_COMPLETION_AVAILABLE_BLOCKS.filter(type => type !== BlockEnum.End)
    return nodes
  },
  getAvailableNextNodes(isChatMode: boolean) {
    const nodes = isChatMode ? ALL_CHAT_AVAILABLE_BLOCKS : ALL_COMPLETION_AVAILABLE_BLOCKS
    return nodes
  },
  checkValid(payload: ContextAssignerNodeType, t: any) {
    if (!payload.conversation_var) {
      return {
        isValid: false,
        errorMessage: t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: 'Conversation Variable' })
      }
    }

    if (!payload.operation) {
      return {
        isValid: false,
        errorMessage: t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: 'Operation' })
      }
    }

    if (payload.operation !== ContextAssignerOperation.Clear) {
      if (!payload.role) {
        return {
          isValid: false,
          errorMessage: t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: 'Role' })
        }
      }
      if (!payload.text) {
        return {
          isValid: false,
          errorMessage: t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: 'Text' })
        }
      }
    }

    return {
      isValid: true,
      errorMessage: '',
    }
  },
}

export default nodeDefault
