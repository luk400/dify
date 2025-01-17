import type { FC } from 'react'
import {
  memo,
  useMemo,
  useRef,
} from 'react'
import type { NodeProps } from 'reactflow'
import { useTranslation } from 'react-i18next'
import NodeGroupItem from './components/node-group-item'
import type { ContextAssignerNodeType } from './types'

const i18nPrefix = 'workflow.nodes.contextAssigner'

const Node: FC<NodeProps<ContextAssignerNodeType>> = (props) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const { id, data } = props
  const { advanced_settings } = data

  const groups = useMemo(() => {
    if (!advanced_settings?.group_enabled) {
      return [{
        groupEnabled: false,
        targetHandleId: 'target',
        title: t(`${i18nPrefix}.title`),
        type: data.output_type,
        variables: data.variables,
        contextAssignerNodeId: id,
        contextAssignerNodeData: data,
      }]
    }
    return advanced_settings.groups.map((group) => {
      return {
        groupEnabled: true,
        targetHandleId: group.groupId,
        title: group.group_name,
        type: group.output_type,
        variables: group.variables,
        contextAssignerNodeId: id,
        contextAssignerNodeData: data,
      }
    })
  }, [t, advanced_settings, data, id])

  return (
    <div className='relative mb-1 px-1 space-y-0.5' ref={ref}>
      {
        groups.map((item) => {
          return (
            <NodeGroupItem
              key={item.title}
              item={item}
            />
          )
        })
      }
    </div >
  )
}

export default memo(Node)
