import { BlockEnum } from '../../types'
import type { NodeDefault } from '../../types'
import type { ConversationManagerNodeType } from './types'
import { ALL_CHAT_AVAILABLE_BLOCKS, ALL_COMPLETION_AVAILABLE_BLOCKS } from '@/app/components/workflow/constants'

const i18nPrefix = 'workflow.errorMsg'

const nodeDefault: NodeDefault<ConversationManagerNodeType> = {
  defaultValue: {
    conversationVariable: [],
    operation: 'add',
    role: 'user',
    text: '',
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
    const { conversationVariable, operation, role, text } = payload

    if (!errorMessages && !conversationVariable)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'Conversation Variable' })
    if (!errorMessages && !operation)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'Operation' })
    if (!errorMessages && operation === 'remove' && !payload.n)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'N' })
    if (!errorMessages && operation === 'add' && !role)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'Role' })
    if (!errorMessages && operation === 'add' && !text)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'Text' })

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault


