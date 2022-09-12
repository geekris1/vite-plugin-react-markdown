import type MarkdownIt from 'markdown-it'
import type { FilterPattern } from '@rollup/pluginutils'
export interface Options {
  markdownItOptions?: MarkdownIt.Options
  markdownItSetup?: (MarkdownIt: MarkdownIt) => void
  wrapperClasses?: string
  include?: FilterPattern
  exclude?: FilterPattern

}

export interface ResolvedOptions extends Required<Options> {

}
