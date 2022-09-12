import { createFilter } from '@rollup/pluginutils'
import type { Plugin } from 'vite'
import { resolveOptions } from './options'
import { createMarkdown } from './markdown'
import type { Options } from './type'

function VitePluginReactMarkdown(useOptions: Options = {}): Plugin {
  const options = resolveOptions(useOptions)
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
      }
      catch (e: any) { this.error(e) }
    },
  } as const
}

export default VitePluginReactMarkdown

