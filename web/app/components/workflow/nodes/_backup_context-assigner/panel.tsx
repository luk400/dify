import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RiArrowDownSLine } from '@remixicon/react'
import useConfig from './use-config'
import type { ConversationManagerNodeType, OperationType, RoleType, WhichType } from './types'
import Field from '@/app/components/workflow/nodes/_base/components/field'
import Split from '@/app/components/workflow/nodes/_base/components/split'
import type { NodePanelProps } from '@/app/components/workflow/types'
import Selector from '@/app/components/workflow/nodes/_base/components/selector'
import Input from '@/app/components/base/input'
import Textarea from '@/app/components/base/textarea'
import VarReferencePicker from '@/app/components/workflow/nodes/_base/components/variable/var-reference-picker'
import cn from '@/utils/classnames'

const operationOptions = [
  { label: 'Add', value: 'add' as OperationType },
  { label: 'Clear', value: 'clear' as OperationType },
  { label: 'Remove', value: 'remove' as OperationType },
]

const roleOptions = [
  { label: 'System', value: 'system' as RoleType },
  { label: 'Assistant', value: 'assistant' as RoleType },
  { label: 'User', value: 'user' as RoleType },
]

const whichOptions = [
  { label: 'First', value: 'first' as WhichType },
  { label: 'Last', value: 'last' as WhichType },
]

const Panel: FC<NodePanelProps<ConversationManagerNodeType>> = ({
  id,
  data,
}) => {
  const { t } = useTranslation()

  const {
    readOnly,
    inputs,
    handleOperationChange,
    handleRoleChange,
    handleTextChange,
    handleNChange,
    handleWhichChange,
    handleVarReferenceChange,
    filterVar,
  } = useConfig(id, data)

  return (
    <div className='mt-2'>
      <div className='px-4 pb-4 space-y-4'>
        <Field title="Conversation Variable">
          <VarReferencePicker
            nodeId={id}
            readonly={readOnly}
            isShowNodeName
            className='grow'
            value={inputs.conversationVariable}
            onChange={handleVarReferenceChange}
            onlyLeafNodeVar={false}
            filterVar={filterVar}
            isSupportFileVar={false}
          />
        </Field>

        <Field title="Operation">
          <Selector
            value={inputs.operation}
            onChange={handleOperationChange}
            options={operationOptions}
            trigger={
              <div className={cn(readOnly && 'cursor-pointer', 'h-8 shrink-0 flex items-center px-2.5 bg-gray-100 border-black/5 rounded-lg')} >
                <div className='w-16 pl-0.5 leading-[18px] text-xs font-medium text-gray-900'>{inputs.operation}</div>
                {!readOnly && <RiArrowDownSLine className='ml-1 w-3.5 h-3.5 text-gray-700' />}
              </div>
            }
            showChecked
            readonly={readOnly}
          />
        </Field>

        {inputs.operation === 'remove' && (
          <>
            <Field title="N">
              <Input
                type="number"
                value={inputs.n}
                onChange={e => handleNChange(parseInt(e.target.value))}
                disabled={readOnly}
              />
            </Field>
            <Field title="Which">
              <Selector
                value={inputs.which}
                onChange={handleWhichChange}
                options={whichOptions}
                trigger={
                  <div className={cn(readOnly && 'cursor-pointer', 'h-8 shrink-0 flex items-center px-2.5 bg-gray-100 border-black/5 rounded-lg')} >
                    <div className='w-16 pl-0.5 leading-[18px] text-xs font-medium text-gray-900'>{inputs.which}</div>
                    {!readOnly && <RiArrowDownSLine className='ml-1 w-3.5 h-3.5 text-gray-700' />}
                  </div>
                }
                showChecked
                readonly={readOnly}
              />
            </Field>
          </>
        )}

        {inputs.operation === 'add' && (
          <Field title="Role">
            <Selector
              value={inputs.role}
              onChange={handleRoleChange}
              options={roleOptions}
              trigger={
                <div className={cn(readOnly && 'cursor-pointer', 'h-8 shrink-0 flex items-center px-2.5 bg-gray-100 border-black/5 rounded-lg')} >
                  <div className='w-20 pl-0.5 leading-[18px] text-xs font-medium text-gray-900'>{inputs.role}</div>
                  {!readOnly && <RiArrowDownSLine className='ml-1 w-3.5 h-3.5 text-gray-700' />}
                </div>
              }
              showChecked
              readonly={readOnly}
            />
          </Field>
        )}

        {inputs.operation === 'add' && inputs.role && (
          <Field title="Text">
            <Textarea
              className="min-h-[100px]"
              placeholder="Enter text"
              value={inputs.text}
              onChange={e => handleTextChange(e.target.value)}
              disabled={readOnly}
            />
          </Field>
        )}
      </div>
      <Split />
    </div>
  )
}

export default React.memo(Panel)
