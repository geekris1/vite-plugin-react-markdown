> The current document is 0.1.X, The latest 0.2.x document is being updated.... It is expected to be finished China Standard Time 11/17. English documents will also be added (from Google Translate)

> 当前文档是0.1.X，最新的0.2。X 版本正在更新... 预计今天完成。英文文档也将被添加 

# vite-plugin-react-markdown
[![NPM version](https://img.shields.io/npm/v/vite-plugin-react-markdown?color=00FFFF)](https://www.npmjs.com/package/vite-plugin-react-markdown)

## 🚀 Features
- 将Markdown转化为React Component
- 再Markdown中使用React Component

## 🔧 Usage

### 安装
```bash
pnpm add vite-plugin-react-markdown -D 
```
### 添加 `vite.config`
```ts
import react from '@vitejs/plugin-react'
import Markdown from 'vite-plugin-react-markdown'

export default {
  plugins: [
    Markdown(),
    react({
      include: [/\.tsx$/, /\.md$/], // <-- 添加.md
    })
  ],
}
```

### 导入markdown作为作为React Component使用
```js
import ReactComponent from './vite-plugin-react-markdown-example.md';

function App() {
  return <ReactComponent />;
}

export default App;
```


### 在Markdown内使用React Component

```react
<Counter/>
```

同时需要添加`options`的配置

```ts {5,7}
import react from '@vitejs/plugin-react'
import Markdown from 'vite-plugin-react-markdown'

export default {
  plugins: [
    Markdown(
    {
      // key 要跟组件名称一致 
      // value 组件所在的路径，相对于根目录
      "Counter":'./src/component/Counter'
    }
    ),
    react({
      include: [/\.tsx$/, /\.md$/], // <-- 添加.md
    })
  ],
}
```


### attributes


```
---
name: vite-plugin-react-markdown
---

# Hello World

```

```js
import React from 'react'
import ReactComponent, { attributes, } from './vite-plugin-react-markdown-example.md';

function App() {
  return (
    <React.Fragment>
      {attributes.name}  {/* vite-plugin-react-markdown */}
      <ReactComponent />
    </React.Fragment  >
  );
}

export default App;


```

### Options

#### markdownItOptions

`vite-plugin-react-markdown` 使用 `markdown-it`,你可在这使用`markdown-it`的配置

具体可参考[markdown-it中文文档](https://markdown-it.docschina.org/#%E7%94%A8%E6%B3%95%E7%A4%BA%E4%BE%8B)

#### markdownItSetup

传递一个函数，它将收到`markdown-it`的实例，你可以在这添加插件

#### markdownItUses

添加`markdown-it`的插件

#### wrapperClasses

默认值: `vite-plugin-react-markdown`

默认会使用一个`div`将markdown内容包裹，你可在这设置这个div得className

#### wrapperComponentPath

你也可以使用一个组件来包裹markdown内容，请输入相对于根目录的组件路径

> 配置这个属性，wrapperClasses将失效，你可自己给组件内自己设置className

#### wrapperComponentName

默认值: `ViteReactMarkdown`

如果你配置了`wrapperComponentPath`，你可以自定义组件加载的名称

## 📖TypeScript Shim

```ts
declare module '*.md' {
  import React from 'react'
  const ReactComponent: React.VFC;
  export default ReactComponent;
  export const attributes = Record<string, any>;
}

// configured wrapperComponentPath, you will use it.
interface WrapperComponentProps {
  attributes: Record<string, any>
  importComponentName: string[]
}
```

## 🌸 Thanks

项目灵感来自于 [vite-plugin-vue-markdown](https://github.com/mdit-vue/vite-plugin-vue-markdown)

部分代码的实现来自 [vite-plugin-markdown](https://github.com/hmsk/vite-plugin-markdown)

## 🐼 Author

[geekris1](https://github.com/geekris1)

