# vite-plugin-react-markdown

<p align='center'>
<a href="https://github.com/geekris1/vite-plugin-react-markdown/blob/master/README.md">English</a>|<b>简体中文</b>    
</p>

[![NPM version](https://img.shields.io/npm/v/vite-plugin-react-markdown?color=00FFFF)](https://www.npmjs.com/package/vite-plugin-react-markdown)

## 🚀 Features

- 将 Markdown 转化为 React Component
- 再 Markdown 中使用 React Component

## 🔧 Usage

### 安装

```bash
pnpm add vite-plugin-react-markdown -D 
# npm i vite-plugin-react-markdown -D 
# yarn add vite-plugin-react-markdown -D
```

### 添加 `vite.config`

```ts
import react from "@vitejs/plugin-react";
import Markdown from "vite-plugin-react-markdown";

export default {
  plugins: [
    Markdown(),
    react({
      include: [/\.tsx$/, /\.md$/], // <-- 添加.md
    }),
  ],
};
```

### 导入 markdown 作为作为 React Component 使用

```js
import ReactComponent from "./vite-plugin-react-markdown-example.md";

function App() {
  return <ReactComponent />;
}

export default App;
```

### 在 Markdown 内使用 React Component

> 使用此功能请确保你的组件使用的 export default 导出 ，而不是 export Component 。
>
> 同时没有重名的组件。

首先你需要配置`wrapperComponent`，你可以设置为`true`，这样所有的的组件都可以在 md 文件里使用(这也将带来一定的性能问题)。

```ts
// vite.config
// 其他代码省略
Markdown({
  wrapperComponent: true,
});
```

你也可以设置为`src/**/*.{jsx,tsx}`，这样只读取 src 文件内的组件。

```ts
Markdown({
  wrapperComponent: "src/**/*.{jsx,tsx}",
});
```

如果你想取多个不同文件夹的组件可以传一个数组。

```ts
Markdown({
  wrapperComponent: "src/**/*.{jsx,tsx}",
});
```

如果你想取多个不同文件夹的组件可以传一个数组。

```ts
Markdown({
  wrapperComponent: ["src/**/*.{jsx,tsx}", "other/**/*.{jsx,tsx}"],
});
```

如果你追求极致的性能也可以指定要加载哪些组件。

需要传递一个对象，key 为组件的名称，value 为相对于根目录的路径

```ts
Markdown({
  wrapperComponent: { Counter: "src/component/Counter/Counter.tsx" },
});
```

完成配置后，你就可以再 md 文件内直接使用对用的组件了

> 如果不是指定的组件，对用的组件名称是其路径名
>
> 如: src/component/`Counter.tsx` , 其组件名为`Counte` （如果首字母是小写，会转化为大写）

```react
# 一个加载组件的例子
<Counter/>
```

### attributes

```ts
// vite-plugin-react-markdown-example.md
---
title: vite-plugin-react-markdown
---

# Hello World

// example.tsx
import React from 'react'
// 额外导入 attributes
import ReactComponent, { attributes } from './vite-plugin-react-markdown-example.md';

function App() {
  return (
    <React.Fragment>
      {attributes.title} {/* attributes.name的值是vite-plugin-react-markdown */}
      <ReactComponent />
    </React.Fragment  >
  );
}

export default App;


```

### 用一个组件处理所有 markdown 文件

当我想给所有组件添加 attributes.title 时,你可以设置`wrapperComponentPath`

首先添加 vite.config 配置

```ts
Markdown({
  wrapperComponent: { Counter: "src/component/Counter/Counter.tsx" },
  wrapperComponentPath: "src/component/Page",
});
```

```tsx
// src/component/Page
import type { ReactNode } from "react";
import React from "react";

interface Props {
  attributes: Record<string, any>;
  children: ReactNode;
}
// props中将包含attributes
function Page(props: Props) {
  const { children, attributes } = props;
  return (
    <React.Fragment>
      <h1>{attributes.name}</h1>
      {children}
    </React.Fragment>
  );
}
export default Page;
```

### Options

#### markdownItOptions

`vite-plugin-react-markdown` 使用 `markdown-it`,你可在这使用`markdown-it`的配置

具体可参考[markdown-it 中文文档](https://markdown-it.docschina.org/#%E7%94%A8%E6%B3%95%E7%A4%BA%E4%BE%8B)

#### markdownItSetup

传递一个函数，它将收到`markdown-it`的实例，你可以在这添加插件

#### markdownItUses

添加`markdown-it`的插件

#### wrapperClasses

默认值: `vite-plugin-react-markdown`

默认会使用一个`div`将 markdown 内容包裹，你可在这设置这个 div 得 className

#### wrapperComponentPath

你也可以使用一个组件来包裹 markdown 内容，请输入相对于根目录的组件路径

> 配置这个属性，wrapperClasses 将失效，你可自己给组件内自己设置 className

#### wrapperComponentName

默认值: `ViteReactMarkdown`

如果你配置了`wrapperComponentPath`，你可以自定义组件加载的名称

## 📖TypeScript Shim

```ts
declare module "*.md" {
  import React from "react";
  const ReactComponent: React.VFC;
  export default ReactComponent;
  export const attributes = Record<string, any>;
}

// configured wrapperComponentPath, you will use it.
interface WrapperComponentProps {
  attributes: Record<string, any>;
  importComponentName: string[];
}
```

## 🌸 Thanks

项目灵感来自于 [vite-plugin-vue-markdown](https://github.com/mdit-vue/vite-plugin-vue-markdown)

部分代码的实现来自 [vite-plugin-markdown](https://github.com/hmsk/vite-plugin-markdown)

## 🐼 Author

[geekris1](https://github.com/geekris1)
