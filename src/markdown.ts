/* eslint-disable @typescript-eslint/quotes */
import MarkdownIt from 'markdown-it'
import { DomUtils, parseDOM } from 'htmlparser2'
import { Element } from 'domhandler'
import { transformSync } from '@babel/core'
import frontMatter from 'front-matter'
import type { Node as DomHandlerNode } from 'domhandler'
import type { ResolvedOptions } from './type'
import { transformAttribs } from './attribs'
import { getComponentPath } from './wrapperComponent'
// const nameSpace = 'VITE_PLUGIN_REACT_COMPONENT'
export function createMarkdown(useOptions: ResolvedOptions) {
  const markdown = new MarkdownIt({ html: true, ...useOptions.markdownItOptions })
  useOptions.markdownItSetup(markdown)

  // use vite TransformResult build error , so use any
  return (raw: string, id: string): any => {
    const { body, attributes } = frontMatter(raw)
    const attributesString = JSON.stringify(attributes)
    const importComponentName: string[] = []
    // from : https://github.com/hmsk/vite-plugin-markdown/blob/main/src/index.ts
    const html = markdown.render(body, { id }).replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
    const root = parseDOM(html, { lowerCaseTags: false })
    root.forEach(markCodeAsPre)
    const h = DomUtils.getOuterHTML(root, { selfClosingTags: true })
      .replace(/"vfm{{/g, '{{')
      .replace(/}}vfm"/g, '}}')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
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
          <${useOptions.wrapperComponentName} attributes={${attributesString}}>
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
    if (useOptions.wrapperComponent && typeof useOptions.wrapperComponent === 'object' && importComponentName.length > 0) {
      importComponentName.forEach((componentName) => {
        const path = useOptions.wrapperComponent![componentName]
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

    // const code = `import React from "react"\nconst ${nameSpace} = {}\n${wrapperComponent}const ReactComponent = ${compiledReactCode}\nexport default ReactComponent\nexport const attributes = ${attributesString} `
    return {
      code,
      map: { mappings: '' } as any,
    }
    function markCodeAsPre(node: DomHandlerNode): void {
      if (node instanceof Element) {
        if (node.tagName.match(/^[A-Z].+/))
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

