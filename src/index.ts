import type { Options } from './type'
import { createFilter } from '@rollup/pluginutils'
import { mergeOptions } from './options'
import { createMarkdown } from './markdown'
import type { Plugin } from 'vite'

function VitePluginReactMarkdown(useOptions: Options = {}): Plugin {
  const options = mergeOptions(useOptions)
  const markdownToReact = createMarkdown(options)
  const filter = createFilter(
    useOptions.include || /\.md$/,
    useOptions.exclude,
  )
  return {
    name: 'vite-plugin-react-markdown',
    enforce: 'pre',
    transform(raw: string, id: string) {
      if (!filter(id))
        return
      try {
        return markdownToReact(raw, id)
      } catch (e: any) { this.error(e) }

    },
  } as const
}

export default VitePluginReactMarkdown

