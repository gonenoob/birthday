## birthday-electron

* 生日记录器
* 支持输入阴阳历生日
* 支持时间范围：1900-2100
* 日历展示
* 后续待扩展，如提醒，联系方式等

## 目录规范
 ```
 main.js 主文件
 config
  webpack.config.${env}.js
  postcss.config.js
 src
  index.js 入口文件
  component: 展示型组件
  container: 容器组件
    component: UI组件 or 业务组件
    constant: 常量定义
    action: action定义
    store: store定义

 
 ```

## 构建
```
npm install
开发
 npm start
 npm run build:dev
打包
 npm run build
 npm run pack
```