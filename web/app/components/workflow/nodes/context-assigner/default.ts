import { BlockEnum } from '../../types'
import type { NodeDefault } from '../../types'
import type { ConversationManagerNodeType } from './types'
import { ALL_CHAT_AVAILABLE_BLOCKS, ALL_COMPLETION_AVAILABLE_BLOCKS } from '@/app/components/workflow/blocks'

const i18nPrefix = 'workflow.errorMsg'

const nodeDefault: NodeDefault<ConversationManagerNodeType> = {
  defaultValue: {
    conversation_variable: [],
    operation: 'add',
    role: 'user',
    how: 'append',
    text: '',
    context: {
      enabled: false,
      variable_selector: [],
    },
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
  checkValid(payload: ConversationManagerNodeType, t: any) {
    let errorMessages = ''
    const { conversation_variable, operation, role, text, n, truncate_length, context, how } = payload
  
    if (!errorMessages && !conversation_variable)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'Conversation Variable' })
    if (!errorMessages && !operation)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'Operation' })
    if (!errorMessages && operation === 'remove' && (!n || n <= 0))
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'N (must be greater than 0)' })
    if (!errorMessages && operation === 'truncate' && (!truncate_length || truncate_length <= 0))
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'Length (must be greater than 0)' })
    if (!errorMessages && operation === 'add' && !role)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'Role' })
    if (!errorMessages && operation === 'add' && !text)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'Text' })
    if (!errorMessages && operation === 'add' && !how)
        errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'How' })
    if (!errorMessages && context?.enabled && !context.variable_selector?.length)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'Context Variable' })
  
    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault


