import { useCallback, useEffect, useRef } from 'react'
import produce from 'immer'
import type { ConversationManagerNodeType, OperationType, RoleType, WhichType } from './types'
import type { Var, ValueSelector } from '../../types'
import { VarType } from '../../types'
import useNodeCrud from '@/app/components/workflow/nodes/_base/hooks/use-node-crud'
import { useNodesReadOnly } from '@/app/components/workflow/hooks'
import { useStore } from '../../store'

const useConfig = (id: string, payload: ConversationManagerNodeType) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const defaultConfig = useStore(s => s.nodesDefaultConfigs)[payload.type]

  const { inputs, setInputs: doSetInputs } = useNodeCrud<ConversationManagerNodeType>(id, payload)
  const inputsRef = useRef(inputs)
  const setInputs = useCallback((newPayload: ConversationManagerNodeType) => {
    doSetInputs(newPayload)
    inputsRef.current = newPayload
  }, [doSetInputs])

  useEffect(() => {
    if (inputs.conversationVariable)
      return

    const isReady = defaultConfig && Object.keys(defaultConfig).length > 0
    if (isReady) {
      setInputs({
        ...inputs,
        ...defaultConfig,
      })
    }
  }, [defaultConfig, inputs, setInputs])

  const handleConversationVariableChange = useCallback((value: string) => {
    const newInputs = produce(inputsRef.current, (draft: any) => {
      draft.conversationVariable = value
    })
    setInputs(newInputs)
  }, [setInputs])

  const handleVarReferenceChange = useCallback((newVar: ValueSelector | string) => {
    const newInputs = produce(inputs, (draft) => {
      draft.conversationVariable = newVar as ValueSelector
    })
    setInputs(newInputs)
  }, [inputs, setInputs])

  const handleOperationChange = useCallback((value: OperationType) => {
    const newInputs = produce(inputsRef.current, (draft: any) => {
      draft.operation = value
      if (value === 'remove' && !draft.which) {
        draft.which = 'first'
      }
    })
    setInputs(newInputs)
  }, [setInputs])

  const handleRoleChange = useCallback((value: RoleType) => {
    const newInputs = produce(inputsRef.current, (draft: any) => {
      draft.role = value
    })
    setInputs(newInputs)
  }, [setInputs])

  const handleTextChange = useCallback((value: string) => {
    const newInputs = produce(inputsRef.current, (draft: any) => {
      draft.text = value
    })
    setInputs(newInputs)
  }, [setInputs])

  const handleNChange = useCallback((value: number) => {
    const newInputs = produce(inputsRef.current, (draft: any) => {
      draft.n = value
    })
    setInputs(newInputs)
  }, [setInputs])

  const handleWhichChange = useCallback((value: WhichType) => {
    const newInputs = produce(inputsRef.current, (draft: any) => {
      draft.which = value
    })
    setInputs(newInputs)
  }, [setInputs])

  const filterVar = useCallback((varPayload: Var) => {
    return [VarType.arrayObject].includes(varPayload.type)
  }, [])

  return {
    readOnly,
    inputs,
    handleConversationVariableChange,
    handleOperationChange,
    handleRoleChange,
    handleTextChange,
    handleNChange,
    handleWhichChange,
    handleVarReferenceChange,
    filterVar,
  }
}

export default useConfig
