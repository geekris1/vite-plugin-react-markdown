import type MarkdownIt from 'markdown-it'
import type { FilterPattern } from '@rollup/pluginutils'
export interface Options {
  markdownItOptions?: MarkdownIt.Options
  markdownItSetup?: (MarkdownIt: MarkdownIt) => void
  include?: FilterPattern
  exclude?: FilterPattern

}
