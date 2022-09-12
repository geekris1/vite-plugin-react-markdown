import type { Options, ResolvedOptions } from './type'
export function mergeOptions(useOptions: Options): ResolvedOptions {
  const defaultOptions = {
    markdownItOptions: {},
    markdownItSetup: () => { },
    wrapperClasses: 'vite-plugin-react-markdown',
    include: null,
    exclude: null,
  }
  return { ...defaultOptions, ...useOptions }
}
