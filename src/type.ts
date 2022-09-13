import type MarkdownIt from 'markdown-it'
import type { FilterPattern } from '@rollup/pluginutils'
export interface WrapperComponent {
  [componentName: string]: string
}
export interface Options {
  markdownItOptions?: MarkdownIt.Options
  markdownItSetup?: (MarkdownIt: MarkdownIt) => void
  wrapperClasses?: string
  wrapperComponentName?: string | null | undefined
  wrapperComponentPath?: string | null | undefined
  wrapperComponent?: WrapperComponent | null | undefined
  include?: FilterPattern
  exclude?: FilterPattern

}

export interface ResolvedOptions extends Required<Options> {

}
