# data-storage

## 概述

data-storage 是 data 插件的一个扩展模块，用于将 localStorage 里的数据映射到当前组件实例上，方便在模板中获取值和在 js 中更新值。

## 安装

```bash
npm i @udock/vue-plugin-data--storage
```

## 配置

### 结合 udock 框架使用

需配合 data 插件使用，在 data 配置中的 plugins 字段中添加 'storage'

### 单独使用

```javascript
import udockData from '@udock/vue-plugin-data'
import UdockDataStoragePligin from '@udock/vue-plugin-data--storage'

Vue.use(udockData, {
  plugins: {
    'storage': UdockDataStoragePligin()
  }
})
```

## 使用说明

### 基本功能

在组件中书写如下面代码：

```javascript
export default {
  data: {
    return {
      'storageData1@storage': 'app.title1',
      'storageData2@storage': ['app.title2'],
      'storageData3@storage': ['app.title3', '初始值'],
      'storageData4@storage': {
        path: 'app.obj',
        writeable: true,
        defaultValue: {text: 'Hello'},
        unsafe: true // 如果 app.obj 是对象，必须设置 unsafe = true，否则将会映射失败
      }
    }
  }
}
```

在组件的模板中可以按如下方式使用：

```html
<template>
  <div>
    {{storageData1}}
    {{storageData2}}
    {{storageData3}}
  </div>
</template>
```

对于在 data 配置中用方括号括起的，是可写变量，在组件中可以直接按如下方式操作：

```javascript
export default {
  data {
    return {
      'storageData2@storage': ['app.title2'],
    }
  },
  methods: {
    doChange () {
      this.storageData2 = 'Hello'
    }
  }
}
```

## 注意事项

* 通过 @storage 设置的引用类型变量无法限制可写，例如配置 data () { return {'obj@storage': 'app.obj'} }，还是可以通过 this.obj.prop1 = 'Hello' 修改 localStorage 中的 app.obj 。
