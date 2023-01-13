/* eslint-disable @typescript-eslint/quotes */
import MarkdownIt from 'markdown-it'
import { DomUtils, parseDOM } from 'htmlparser2'
import { Element } from 'domhandler'
import { transformSync } from '@babel/core'
import frontMatter from 'front-matter'
import { toArray } from '@antfu/utils'
import type { TransformResult } from 'vite'
import type { Node as DomHandlerNode } from 'domhandler'
import type { ResolvedOptions } from './type'
import { transformAttribs } from './attribs'
import { getComponentPath, getWrapperComponent } from './wrapperComponent'
export function createMarkdown(useOptions: ResolvedOptions) {
  const markdown = new MarkdownIt({ html: true, ...useOptions.markdownItOptions })
  useOptions.markdownItUses.forEach((e) => {
    const [plugin, options] = toArray(e)
    markdown.use(plugin, options)
  })
  useOptions.markdownItSetup(markdown)

  return async (raw: string, id: string): Promise<TransformResult> => {
    const { body, attributes } = frontMatter(raw)
    const attributesString = JSON.stringify(attributes)
    const wrapperComponentData = await getWrapperComponent(useOptions.wrapperComponent)
    const importComponentName: string[] = []
    // partial transform code from : https://github.com/hmsk/vite-plugin-markdown/blob/main/src/index.ts
    const html = markdown.render(body, { id })
    const root = parseDOM(html, { lowerCaseTags: false })
    root.forEach(markCodeAsPre)
    const h = DomUtils.getOuterHTML(root, { selfClosingTags: true })
      .replace(/"vfm{{/g, '{{')
      .replace(/}}vfm"/g, '}}')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      // handle notes
      .replace(/<!--/g, '{/*')
      .replace(/-->/g, '*/}')
    let reactCode
    let wrapperComponent = ''
    if (useOptions.wrapperComponentPath) {
      const componentPath = getComponentPath(id, useOptions.wrapperComponentPath)
      wrapperComponent = `import ${useOptions.wrapperComponentName} from '${componentPath}'\n`
      reactCode = `
        const markdown =
          <${useOptions.wrapperComponentName} 
            attributes={${attributesString}}
            importComponentName={${JSON.stringify(importComponentName)}}
          >
            <React.Fragment>
              ${h} 
            </React.Fragment> 
          </${useOptions.wrapperComponentName}>
      `
    }
    else {
      reactCode = `
        const markdown =
          <div className='${useOptions.wrapperClasses}'>
            ${h}
          </div>
      `
    }
    let importComponent = ""
    if (wrapperComponentData && typeof wrapperComponentData === 'object' && importComponentName.length > 0) {
      importComponentName.forEach((componentName) => {
        const path = wrapperComponentData![componentName]
        if (path)
          importComponent += `import ${componentName} from '${getComponentPath(id, path)}'\n`
      })
    }

    const compiledReactCode = `
  function (props) {
    ${transformSync(reactCode, { ast: false, presets: ['@babel/preset-react'] })!.code}
    return markdown
  } 
`
    let code = `import React from 'react'\n`
    code += `${wrapperComponent}`
    code += `${importComponent}`
    code += `const ReactComponent = ${compiledReactCode}\n`
    code += `export default ReactComponent\n`
    code += `export const attributes = ${attributesString}`
    return {
      code,
      map: { mappings: '' } as any,
    }
    function markCodeAsPre(node: DomHandlerNode): void {
      if (node instanceof Element) {
        if (node.tagName.match(/^[A-Z].+/) && !importComponentName.includes(node.tagName))
          importComponentName.push(node.tagName)

        transformAttribs(node.attribs)
        if (node.tagName === 'code') {
          const codeContent = DomUtils.getInnerHTML(node, { decodeEntities: true })
          node.attribs.dangerouslySetInnerHTML = `vfm{{ __html: \`${codeContent.replace(/([\\`])/g, '\\$1')}\`}}vfm`
          node.childNodes = []
        }
        if (node.childNodes.length > 0)
          node.childNodes.forEach(markCodeAsPre)
      }
    }
  }
}
