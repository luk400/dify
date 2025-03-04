import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RiArrowDownSLine } from '@remixicon/react'
import useConfig from './use-config'
import type { ConversationManagerNodeType, OperationType, RoleType, WhichType, HowType } from './types'
import Field from '@/app/components/workflow/nodes/_base/components/field'
import Split from '@/app/components/workflow/nodes/_base/components/split'
import type { NodePanelProps } from '@/app/components/workflow/types'
import Selector from '@/app/components/workflow/nodes/_base/components/selector'
import Tooltip from '@/app/components/base/tooltip'
import Editor from '@/app/components/workflow/nodes/_base/components/prompt/editor'
import Input from '@/app/components/base/input'
import Textarea from '@/app/components/base/textarea'
import VarReferencePicker from '@/app/components/workflow/nodes/_base/components/variable/var-reference-picker'
import cn from '@/utils/classnames'

const operationOptions = [
  { label: 'Add', value: 'add' as OperationType },
  { label: 'Clear', value: 'clear' as OperationType },
  { label: 'Remove', value: 'remove' as OperationType },
  { label: 'Truncate', value: 'truncate' as OperationType },
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

const addHowOptions = [
  { label: 'Prepend', value: 'prepend' as HowType },
  { label: 'Append', value: 'append' as HowType },
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
    handleTruncateLengthChange,
    handleRoleChange,
    handleTextChange,
    handleNChange,
    handleWhichChange,
    handleHowChange,
    handleVarReferenceChange,
    filterVar,
    availableVars,
    availableNodesWithParent,
    handleContextVarChange,
    filterContextVar,
  } = useConfig(id, data)

  return (
    <div className='mt-2'>
      <div className='px-4 pb-4 space-y-4'>
        <Field title="Conversation Variable">
          <VarReferencePicker
            nodeId={id}
            readonly={readOnly}
            isShowNodeName
            value={inputs.conversation_variable}
            onChange={handleVarReferenceChange}
            filterVar={filterContextVar}
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
                min={1}
                value={inputs.n}
                onChange={e => {
                  const value = parseInt(e.target.value)
                  if (value > 0 || e.target.value === '') 
                    handleNChange(value)
                }}
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

        {inputs.operation === 'truncate' && (
          <Field title="Length">
            <Input
              type="number"
              min={1}
              value={inputs.truncate_length}
              onChange={e => {
                const value = parseInt(e.target.value)
                if (value > 0 || e.target.value === '') 
                  handleTruncateLengthChange(value)
              }}
              disabled={readOnly}
            />
          </Field>
        )}

        {inputs.operation === 'add' && (
          <Field title="How">
            <Selector
              value={inputs.how}
              onChange={handleHowChange}
              options={addHowOptions}
              trigger={
                <div className={cn(readOnly && 'cursor-pointer', 'h-8 shrink-0 flex items-center px-2.5 bg-gray-100 border-black/5 rounded-lg')} >
                  <div className='w-16 pl-0.5 leading-[18px] text-xs font-medium text-gray-900'>{inputs.how}</div>
                  {!readOnly && <RiArrowDownSLine className='ml-1 w-3.5 h-3.5 text-gray-700' />}
                </div>
              }
              showChecked
              readonly={readOnly}
            />
          </Field>
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

        {inputs.operation === 'add' && (
          <Field title="Context">
            <VarReferencePicker
              nodeId={id}
              readonly={readOnly}
              isShowNodeName
              value={inputs.context?.variable_selector || []}
              onChange={handleContextVarChange}
              filterVar={filterContextVar}
            />
          </Field>
        )}

        {inputs.operation === 'add' && inputs.role && (
          <Field title="Text">
            <Editor
              title={''}
              value={inputs.text}
              onChange={e => handleTextChange(e)}
              readOnly={readOnly}
              isShowContext={true}
              isChatApp={true}
              isChatModel={true}
              nodesOutputVars={availableVars}
              availableNodes={availableNodesWithParent}
              isSupportFileVar={true}
              hasSetBlockStatus={{
                context: !inputs.context?.enabled || inputs.context?.variable_selector?.length === 0,
                query: false,
                history: false
              }}
            />
          </Field>
        )}
      </div>
      <Split />
    </div>
  )
}

export default React.memo(Panel)
