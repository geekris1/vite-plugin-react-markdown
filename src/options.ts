import type { Options } from './type'
export function mergeOptions(useOptions: Options) {
  const defaultOptions = {
    markdownItOptions: {},
  }
  return { ...defaultOptions, ...useOptions }
}
