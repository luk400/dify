import { useCallback } from 'react'

export const useHandleAddVariable = () => {
  return useCallback((variables: any[]) => {
    return [...variables, []]
  }, [])
}
