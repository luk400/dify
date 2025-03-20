//import { useCallback, useEffect, useRef } from 'react'
//import produce from 'immer'
//import type { ConversationManagerNodeType, OperationType, RoleType, WhichType, HowType } from './types'
//import type { Var, ValueSelector } from '../../types'
//import { VarType } from '../../types'
//import useNodeCrud from '@/app/components/workflow/nodes/_base/hooks/use-node-crud'
//import { useNodesReadOnly } from '@/app/components/workflow/hooks'
//import { useStore } from '../../store'
//import useAvailableVarList from '../_base/hooks/use-available-var-list'
//
//const useConfig = (id: string, payload: ConversationManagerNodeType) => {
//  const { nodesReadOnly: readOnly } = useNodesReadOnly()
//  const defaultConfig = useStore(s => s.nodesDefaultConfigs)[payload.type]
//
//  const { inputs, setInputs: doSetInputs } = useNodeCrud<ConversationManagerNodeType>(id, payload)
//  const inputsRef = useRef(inputs)
//  const setInputs = useCallback((newPayload: ConversationManagerNodeType) => {
//    doSetInputs(newPayload)
//    inputsRef.current = newPayload
//  }, [doSetInputs])
//
//  useEffect(() => {
//    if (inputs.conversation_variable)
//      return
//
//    const isReady = defaultConfig && Object.keys(defaultConfig).length > 0
//    if (isReady) {
//      setInputs({
//        ...inputs,
//        ...defaultConfig,
//      })
//    }
//  }, [defaultConfig, inputs, setInputs])
//
//  const handleConversationVariableChange = useCallback((value: string) => {
//    const newInputs = produce(inputsRef.current, (draft: any) => {
//      draft.conversation_variable = value
//    })
//    setInputs(newInputs)
//  }, [setInputs])
//
//
//  const handleVarReferenceChange = useCallback((newVar: ValueSelector | string) => {
//    const newInputs = produce(inputs, (draft) => {
//      draft.conversation_variable = newVar as ValueSelector
//    })
//    setInputs(newInputs)
//  }, [inputs, setInputs])
//
//  const filterMemoryPromptVar = useCallback((varPayload: Var) => {
//    return [VarType.arrayObject, VarType.array, VarType.number, VarType.string, VarType.secret, VarType.arrayString, VarType.arrayNumber, VarType.file, VarType.arrayFile].includes(varPayload.type)
//  }, [])
//
//  const {
//    availableVars,
//    availableNodesWithParent,
//  } = useAvailableVarList(id, {
//    onlyLeafNodeVar: false,
//    filterVar: filterMemoryPromptVar,
//  })
//
//  const handleOperationChange = useCallback((value: OperationType) => {
//    const newInputs = produce(inputsRef.current, (draft: any) => {
//      draft.operation = value
//      if (value === 'remove' && !draft.which) {
//        draft.which = 'first'
//      }
//      if (value === 'truncate' && !draft.truncate_length) {
//        draft.truncate_length = 1
//      }
//    })
//    setInputs(newInputs)
//  }, [setInputs])
//
//  const handleTruncateLengthChange = useCallback((value: number) => {
//    const newInputs = produce(inputsRef.current, (draft: any) => {
//      draft.truncate_length = value
//    })
//    setInputs(newInputs)
//  }, [setInputs])
//
//  const handleRoleChange = useCallback((value: RoleType) => {
//    const newInputs = produce(inputsRef.current, (draft: any) => {
//      draft.role = value
//    })
//    setInputs(newInputs)
//  }, [setInputs])
//
//  const handleTextChange = useCallback((value: string) => {
//    const newInputs = produce(inputsRef.current, (draft: any) => {
//      draft.text = value
//    })
//    setInputs(newInputs)
//  }, [setInputs])
//
//  const handleNChange = useCallback((value: number) => {
//    const newInputs = produce(inputsRef.current, (draft: any) => {
//      draft.n = value
//    })
//    setInputs(newInputs)
//  }, [setInputs])
//
//  const handleWhichChange = useCallback((value: WhichType) => {
//    const newInputs = produce(inputsRef.current, (draft: any) => {
//      draft.which = value
//    })
//    setInputs(newInputs)
//  }, [setInputs])
//
//  const handleHowChange = useCallback((value: HowType) => {
//    const newInputs = produce(inputsRef.current, (draft: any) => {
//      draft.how = value
//    })
//    setInputs(newInputs)
//  }, [setInputs])
//
//
//  const filterVar = useCallback((varPayload: Var) => {
//    return [VarType.arrayObject].includes(varPayload.type)
//  }, [])
//
//  const handleContextVarChange = useCallback((newVar: ValueSelector | string) => {
//    const newInputs = produce(inputs, (draft) => {
//      if (!draft.context) {
//        draft.context = {
//          enabled: false,
//          variable_selector: []
//        }
//      }
//      draft.context.variable_selector = newVar as ValueSelector || []
//      draft.context.enabled = !!(newVar && (newVar as ValueSelector).length > 0)
//    })
//    setInputs(newInputs)
//  }, [inputs, setInputs])
//
//  const filterContextVar = useCallback((varPayload: Var) => {
//    return [VarType.arrayObject, VarType.array, VarType.string].includes(varPayload.type)
//  }, [])
//
//  return {
//    readOnly,
//    inputs,
//    handleConversationVariableChange,
//    handleOperationChange,
//    handleTruncateLengthChange,
//    handleRoleChange,
//    handleTextChange,
//    handleNChange,
//    handleWhichChange,
//    handleHowChange,
//    handleVarReferenceChange,
//    filterVar,
//    availableVars,
//    availableNodesWithParent,
//    handleContextVarChange,
//    filterContextVar
//  }
//}
//
//export default useConfig


import { useCallback, useEffect, useRef } from 'react'
import produce from 'immer'
import type { ConversationManagerNodeType, OperationType, RoleType, WhichType, HowType } from './types'
import type { Var, ValueSelector } from '../../types'
import { VarType } from '../../types'
import useNodeCrud from '@/app/components/workflow/nodes/_base/hooks/use-node-crud'
import { useNodesReadOnly } from '@/app/components/workflow/hooks'
import { useStore } from '../../store'
import useAvailableVarList from '../_base/hooks/use-available-var-list'
import { useHandleAddVariable } from './hooks'

const useConfig = (id: string, payload: ConversationManagerNodeType) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const defaultConfig = useStore(s => s.nodesDefaultConfigs)[payload.type]
  const handleAddVariable = useHandleAddVariable()

  const { inputs, setInputs: doSetInputs } = useNodeCrud<ConversationManagerNodeType>(id, payload)
  const inputsRef = useRef(inputs)
  const setInputs = useCallback((newPayload: ConversationManagerNodeType) => {
    doSetInputs(newPayload)
    inputsRef.current = newPayload
  }, [doSetInputs])

  useEffect(() => {
    if (inputs.conversation_variables && inputs.conversation_variables.length > 0)
      return

    const isReady = defaultConfig && Object.keys(defaultConfig).length > 0
    if (isReady) {
      setInputs({
        ...inputs,
        ...defaultConfig,
      })
    }
  }, [defaultConfig, inputs, setInputs])

  const handleVarReferenceChange = useCallback((newVar: ValueSelector | string, index: number) => {
    const newInputs = produce(inputs, (draft) => {
      draft.conversation_variables[index] = newVar as ValueSelector
    })
    setInputs(newInputs)
  }, [inputs, setInputs])

  const handleAddNewVariable = useCallback(() => {
    const newList = handleAddVariable(inputs.conversation_variables || [])
    const newInputs = produce(inputs, (draft) => {
      draft.conversation_variables = newList
    })
    setInputs(newInputs)
  }, [inputs, setInputs, handleAddVariable])

  const handleRemoveVariable = useCallback((index: number) => {
    const newInputs = produce(inputs, (draft) => {
      draft.conversation_variables.splice(index, 1)
    })
    setInputs(newInputs)
  }, [inputs, setInputs])

  const filterMemoryPromptVar = useCallback((varPayload: Var) => {
    return [VarType.arrayObject, VarType.array, VarType.number, VarType.string, VarType.secret, VarType.arrayString, VarType.arrayNumber, VarType.file, VarType.arrayFile].includes(varPayload.type)
  }, [])

  const {
    availableVars,
    availableNodesWithParent,
  } = useAvailableVarList(id, {
    onlyLeafNodeVar: false,
    filterVar: filterMemoryPromptVar,
  })

  const handleOperationChange = useCallback((value: OperationType) => {
    const newInputs = produce(inputsRef.current, (draft: any) => {
      draft.operation = value
      if (value === 'remove' && !draft.which) {
        draft.which = 'first'
      }
      if (value === 'truncate' && !draft.truncate_length) {
        draft.truncate_length = 1
      }
    })
    setInputs(newInputs)
  }, [setInputs])

  const handleTruncateLengthChange = useCallback((value: number) => {
    const newInputs = produce(inputsRef.current, (draft: any) => {
      draft.truncate_length = value
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

  const handleHowChange = useCallback((value: HowType) => {
    const newInputs = produce(inputsRef.current, (draft: any) => {
      draft.how = value
    })
    setInputs(newInputs)
  }, [setInputs])


  const filterVar = useCallback((varPayload: Var) => {
    return [VarType.arrayObject].includes(varPayload.type)
  }, [])

  const handleContextVarChange = useCallback((newVar: ValueSelector | string) => {
    const newInputs = produce(inputs, (draft) => {
      if (!draft.context) {
        draft.context = {
          enabled: false,
          variable_selector: []
        }
      }
      draft.context.variable_selector = newVar as ValueSelector || []
      draft.context.enabled = !!(newVar && (newVar as ValueSelector).length > 0)
    })
    setInputs(newInputs)
  }, [inputs, setInputs])

  const filterContextVar = useCallback((varPayload: Var) => {
    return [VarType.arrayObject, VarType.array, VarType.string].includes(varPayload.type)
  }, [])

  return {
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
    handleAddNewVariable,
    handleRemoveVariable,
    filterVar,
    availableVars,
    availableNodesWithParent,
    handleContextVarChange,
    filterContextVar
  }
}

export default useConfig
