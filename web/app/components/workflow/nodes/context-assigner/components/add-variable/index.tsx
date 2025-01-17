import {
  memo,
  useCallback,
  useState,
} from 'react'
import { useContextAssigner } from '../../hooks'
import type { ContextAssignerNodeType } from '../../types'
import cn from '@/utils/classnames'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import { Plus02 } from '@/app/components/base/icons/src/vender/line/general'
import AddVariablePopup from '@/app/components/workflow/nodes/_base/components/add-variable-popup'
import type {
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/app/components/workflow/types'

export type AddVariableProps = {
  contextAssignerNodeId: string
  contextAssignerNodeData: ContextAssignerNodeType
  availableVars: NodeOutPutVar[]
  handleId?: string
}
const AddVariable = ({
  availableVars,
  contextAssignerNodeId,
  contextAssignerNodeData,
  handleId,
}: AddVariableProps) => {
  const [open, setOpen] = useState(false)
  const { handleAssignVariableValueChange } = useContextAssigner()

  const handleSelectVariable = useCallback((v: ValueSelector, varDetail: Var) => {
    handleAssignVariableValueChange(
      contextAssignerNodeId,
      v,
      varDetail,
      handleId,
    )
    setOpen(false)
  }, [handleAssignVariableValueChange, contextAssignerNodeId, handleId, setOpen])

  return (
    <div className={cn(
      open && '!flex',
      contextAssignerNodeData.selected && '!flex',
    )}>
      <PortalToFollowElem
        placement={'right'}
        offset={4}
        open={open}
        onOpenChange={setOpen}
      >
        <PortalToFollowElemTrigger
          onClick={() => setOpen(!open)}
        >
          <div
            className={cn(
              'group/addvariable flex items-center justify-center',
              'w-4 h-4 cursor-pointer',
              'hover:rounded-full hover:bg-primary-600',
              open && '!rounded-full !bg-primary-600',
            )}
          >
            <Plus02
              className={cn(
                'w-2.5 h-2.5 text-gray-500',
                'group-hover/addvariable:text-white',
                open && '!text-white',
              )}
            />
          </div>
        </PortalToFollowElemTrigger>
        <PortalToFollowElemContent className='z-[1000]'>
          <AddVariablePopup
            onSelect={handleSelectVariable}
            availableVars={availableVars}
          />
        </PortalToFollowElemContent>
      </PortalToFollowElem>
    </div>
  )
}

export default memo(AddVariable)
