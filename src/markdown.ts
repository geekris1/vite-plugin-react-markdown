import MarkdownIt from 'markdown-it'
import { DomUtils, parseDOM } from 'htmlparser2'
import { Element } from 'domhandler'
import { transformSync } from '@babel/core'
import frontMatter from 'front-matter'
import type { Node as DomHandlerNode } from 'domhandler'
import type { ResolvedOptions } from './type'
import { transformAttribs } from './attribs'
import { getComponentPath } from './wrapperComponent'
const nameSpace = 'VITE_PLUGIN_REACT_COMPONENT'
export function createMarkdown(useOptions: ResolvedOptions) {
  const markdown = new MarkdownIt({ html: true, xhtmlOut: true, ...useOptions.markdownItOptions })
  useOptions.markdownItSetup(markdown)

  // use vite TransformResult build error , so use any
  return (raw: string, id: string): any => {
    const { body } = frontMatter(raw)
    // from : https://github.com/hmsk/vite-plugin-markdown/blob/main/src/index.ts
    const html = markdown.render(body, { id })
    const root = parseDOM(html)
    root.forEach(markCodeAsPre)
    const h = DomUtils.getOuterHTML(root, { selfClosingTags: true })
      .replace(/"vfm{{/g, '{{')
      .replace(/}}vfm"/g, '}}')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      // handle notes
      .replace(/<!-- ---/g, '{/*')
      .replace(/--- -->/g, '*/}')
    let reactCode
    let wrapperComponent = ''
    if (useOptions.wrapperComponentPath) {
      const componentPath = getComponentPath(id, useOptions.wrapperComponentPath)
      wrapperComponent = `import ${useOptions.wrapperComponentName} from '${componentPath}'\n`
      reactCode = `
        const markdown =
          <${useOptions.wrapperComponentName}>
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

    const compiledReactCode = `
  function (props) {
    Object.keys(props).forEach(function (key) {
      SubReactComponent[key] = props[key]
    })
    ${transformSync(reactCode, { ast: false, presets: ['@babel/preset-react'] })!.code}
    return markdown
  } 
`
    const code = `import React from "react"\nconst ${nameSpace} = {}\n${wrapperComponent}const ReactComponent = ${compiledReactCode}\nexport default ReactComponent`
    return {
      code,
      map: { mappings: '' } as any,
    }
  }
}

function markCodeAsPre(node: DomHandlerNode): void {
  if (node instanceof Element) {
    if (node.tagName.match(/^[A-Z].+/))
      node.tagName = `${nameSpace}.${node.tagName}`
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
