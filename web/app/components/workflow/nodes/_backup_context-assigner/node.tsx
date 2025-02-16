import type { FC } from 'react'
import React from 'react'
import type { ConversationManagerNodeType } from './types'
import type { NodeProps } from '@/app/components/workflow/types'

const Node: FC<NodeProps<ConversationManagerNodeType>> = () => {
  return (
    <div></div>
  )
}

export default React.memo(Node)


