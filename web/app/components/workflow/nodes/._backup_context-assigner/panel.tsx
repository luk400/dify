//import type { FC } from 'react'
//import React from 'react'
//import { useTranslation } from 'react-i18next'
//import Field from '../_base/components/field'
//import RemoveEffectVarConfirm from '../_base/components/remove-effect-var-confirm'
//import useConfig from './use-config'
//import type { ContextAssignerNodeType } from './types'
//import VarGroupItem from './components/var-group-item'
//import cn from '@/utils/classnames'
//import { type NodePanelProps } from '@/app/components/workflow/types'
//import Split from '@/app/components/workflow/nodes/_base/components/split'
//import OutputVars, { VarItem } from '@/app/components/workflow/nodes/_base/components/output-vars'
//import Switch from '@/app/components/base/switch'
//import AddButton from '@/app/components/workflow/nodes/_base/components/add-button'
//
//const i18nPrefix = 'workflow.nodes.contextAssigner'
//const Panel: FC<NodePanelProps<ContextAssignerNodeType>> = ({
//  id,
//  data,
//}) => {
//  const { t } = useTranslation()
//
//  const {
//    readOnly,
//    inputs,
//    handleListOrTypeChange,
//    isEnableGroup,
//    handleGroupEnabledChange,
//    handleAddGroup,
//    handleListOrTypeChangeInGroup,
//    handleGroupRemoved,
//    handleVarGroupNameChange,
//    isShowRemoveVarConfirm,
//    hideRemoveVarConfirm,
//    onRemoveVarConfirm,
//    getAvailableVars,
//    filterVar,
//  } = useConfig(id, data)
//
//  return (
//    <div className='mt-2'>
//      <div className='px-4 pb-4 space-y-4'>
//        {!isEnableGroup
//          ? (
//            <VarGroupItem
//              readOnly={readOnly}
//              nodeId={id}
//              payload={{
//                output_type: inputs.output_type,
//                variables: inputs.variables,
//              }}
//              onChange={handleListOrTypeChange}
//              groupEnabled={false}
//              availableVars={getAvailableVars(id, 'target', filterVar(inputs.output_type), true)}
//            />
//          )
//          : (<div>
//            <div className='space-y-2'>
//              {inputs.advanced_settings?.groups.map((item, index) => (
//                <div key={item.groupId}>
//                  <VarGroupItem
//                    readOnly={readOnly}
//                    nodeId={id}
//                    payload={item}
//                    onChange={handleListOrTypeChangeInGroup(item.groupId)}
//                    groupEnabled
//                    canRemove={!readOnly && inputs.advanced_settings?.groups.length > 1}
//                    onRemove={handleGroupRemoved(item.groupId)}
//                    onGroupNameChange={handleVarGroupNameChange(item.groupId)}
//                    availableVars={getAvailableVars(id, item.groupId, filterVar(item.output_type), true)}
//                  />
//                  {index !== inputs.advanced_settings?.groups.length - 1 && <Split className='my-4' />}
//                </div>
//
//              ))}
//            </div>
//            <AddButton
//              className='mt-2'
//              text={t(`${i18nPrefix}.addGroup`)}
//              onClick={handleAddGroup}
//            />
//          </div>)}
//      </div>
//      <Split />
//      <div className={cn('px-4 pt-4', isEnableGroup ? 'pb-4' : 'pb-2')}>
//        <Field
//          title={t(`${i18nPrefix}.aggregationGroup`)}
//          tooltip={t(`${i18nPrefix}.aggregationGroupTip`)!}
//          operations={
//            <Switch
//              defaultValue={isEnableGroup}
//              onChange={handleGroupEnabledChange}
//              size='md'
//              disabled={readOnly}
//            />
//          }
//        />
//      </div>
//      {isEnableGroup && (
//        <>
//          <Split />
//          <div className='px-4 pt-4 pb-2'>
//            <OutputVars>
//              <>
//                {inputs.advanced_settings?.groups.map((item, index) => (
//                  <VarItem
//                    key={index}
//                    name={`${item.group_name}.output`}
//                    type={item.output_type}
//                    description={t(`${i18nPrefix}.outputVars.varDescribe`, {
//                      groupName: item.group_name,
//                    })}
//                  />
//                ))}
//              </>
//            </OutputVars>
//          </div>
//        </>
//      )}
//      <RemoveEffectVarConfirm
//        isShow={isShowRemoveVarConfirm}
//        onCancel={hideRemoveVarConfirm}
//        onConfirm={onRemoveVarConfirm}
//      />
//    </div>
//  )
//}
//
//export default React.memo(Panel)

import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Field from '../_base/components/field'
import useConfig from './use-config'
import type { ContextAssignerNodeType } from './types'
import { ContextAssignerOperation } from './types'
import { type NodePanelProps } from '@/app/components/workflow/types'
import Input from '@/app/components/base/input'
import Select from '@/app/components/base/select'

const i18nPrefix = 'workflow.nodes.contextAssigner'

const Panel: FC<NodePanelProps<ContextAssignerNodeType>> = ({
  id,
  data,
}) => {
  const { t } = useTranslation()
  const {
    readOnly,
    inputs,
    handleConversationVarChange,
    handleOperationChange,
    handleRoleChange,
    handleTextChange,
  } = useConfig(id, data)

  const operationOptions = [
    { value: ContextAssignerOperation.Clear, label: t(`${i18nPrefix}.operations.clear`) },
    { value: ContextAssignerOperation.Append, label: t(`${i18nPrefix}.operations.append`) },
    { value: ContextAssignerOperation.Prepend, label: t(`${i18nPrefix}.operations.prepend`) },
  ]

  const showAdditionalFields = inputs.operation === ContextAssignerOperation.Append || 
                             inputs.operation === ContextAssignerOperation.Prepend

  return (
    <div className='mt-2'>
      <div className='px-4 pb-4 space-y-4'>
        <Field
          title={t(`${i18nPrefix}.conversationVar`)}
          required
        >
          <Input
            value={inputs.conversation_var}
            onChange={handleConversationVarChange}
            disabled={readOnly}
            placeholder={t(`${i18nPrefix}.conversationVarPlaceholder`)}
          />
        </Field>

        <Field
          title={t(`${i18nPrefix}.operation`)}
          required
        >
          <Select
            value={inputs.operation}
            options={operationOptions}
            onChange={handleOperationChange}
            disabled={readOnly}
          />
        </Field>

        {showAdditionalFields && (
          <>
            <Field
              title={t(`${i18nPrefix}.role`)}
              required
            >
              <Input
                value={inputs.role}
                onChange={handleRoleChange}
                disabled={readOnly}
                placeholder={t(`${i18nPrefix}.rolePlaceholder`)}
              />
            </Field>

            <Field
              title={t(`${i18nPrefix}.text`)}
              required
            >
              <Input
                value={inputs.text}
                onChange={handleTextChange}
                disabled={readOnly}
                placeholder={t(`${i18nPrefix}.textPlaceholder`)}
              />
            </Field>
          </>
        )}
      </div>
    </div>
  )
}

export default React.memo(Panel)
