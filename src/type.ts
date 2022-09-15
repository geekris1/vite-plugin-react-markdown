import type MarkdownIt from 'markdown-it'
import type { FilterPattern } from '@rollup/pluginutils'

/**
   * key :componentName
   * value: vite.config to the Component relative path
  */
export interface WrapperComponent {
  [componentName: string]: string
}
export interface Options {
  /**
   * Options passed to Markdown It
  */
  markdownItOptions?: MarkdownIt.Options
  /**
   * Plugins for Markdown It
  */
  markdownItUses?: (
    | MarkdownIt.PluginSimple
    | [MarkdownIt.PluginSimple | MarkdownIt.PluginWithOptions<any>, any]
    | any
  )[]
  /**
   * A function providing the Markdown It instance gets the ability to apply custom
   * settings/plugins
  */
  markdownItSetup?: (MarkdownIt: MarkdownIt) => void
  /**
   * Class names for wrapper div
   *
   * @default 'vite-plugin-react-markdown'
   */
  wrapperClasses?: string
  /**
   * Component name to wrapper with
   *
   * @default ViteReactMarkdown
   */
  wrapperComponentName?: string | null | undefined
  /**
   * Component Path to wrapper with
   * vite.config to the Component relative path
   *
   * @default 'ViteReactMarkdown'
   */
  wrapperComponentPath?: string | null | undefined

  /**
   * used Component within .md file
   * @default 'ViteReactMarkdown'
   */
  wrapperComponent?: WrapperComponent | null | undefined
  include?: FilterPattern
  exclude?: FilterPattern

}

export interface ResolvedOptions extends Required<Options> {

}
