import type { CommonNodeType, Memory, ModelConfig, PromptItem, ValueSelector, Variable, VisionSetting } from '@/app/components/workflow/types'

export type LLMNodeType = CommonNodeType & {
  model: ModelConfig
  conversation_variable?: ValueSelector
  prompt_template: PromptItem[] | PromptItem
  prompt_config?: {
    jinja2_variables?: Variable[]
  }
  memory?: Memory
  context: {
    enabled: boolean
    variable_selector: ValueSelector
  }
  vision: {
    enabled: boolean
    configs?: VisionSetting
  }
}
