import type { Options, ResolvedOptions } from './type'
export function resolveOptions(useOptions: Options): ResolvedOptions {
  const defaultOptions = {
    markdownItOptions: {},
    markdownItSetup: () => { },
    wrapperClasses: 'vite-plugin-react-markdown',
    wrapperComponentName: 'ViteReactMarkdown',
    markdownItUses: [],
    wrapperComponentPath: undefined,
    wrapperComponent: undefined,
    include: null,
    exclude: null,
  }
  return { ...defaultOptions, ...useOptions } as ResolvedOptions
}
