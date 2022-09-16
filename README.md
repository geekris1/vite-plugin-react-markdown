# vite-plugin-react-markdown
[![NPM version](https://img.shields.io/npm/v/vite-plugin-react-markdown?color=a1b858)](https://www.npmjs.com/package/vite-plugin-react-markdown)

## 🚀 Features
- 将Markdown转化为React Component
- 再Markdown中使用React Component

## 🔧 Usage

### 安装
```bash
pnpm add vite-plugin-vue-markdown -D 
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
```react
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

同时需要在添加`options`的配置

```ts {5,7}
import react from '@vitejs/plugin-react'
import Markdown from 'vite-plugin-react-markdown'

export default {
  plugins: [
    Markdown(
    {
      // key 要跟组件名称一致 
      // value 组件所在的路径，相对于vite.config
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

事例
```
---
name: vite-plugin-react-markdown
---

# Hello World

```

```js
import ReactComponent , {attributes} from './vite-plugin-react-markdown-example.md';

function App() {
 
  return <>
    {attributes.name} // vite-plugin-react-markdown
    <ReactComponent />
  </> ;
}

export default App;

```
