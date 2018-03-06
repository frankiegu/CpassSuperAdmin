# so-superadmin 智众总后台管理前端项目

## 相关文档
[前端文档](https://gitlab.gzleihou.cn/FE/docs)：https://gitlab.gzleihou.cn/FE/docs

## 如果有不能设置颜色的svg，可以用这个备用方案
``` bash
下载svg文件至src/icons/svg下，执行命令生成svgo：svgo -f ./svg
没有安装svgo，全局安装一下：npm install -g svgo
```

## 在线访问
[本地开发](http://localhost:8989)：http://localhost:8989
登录账号：13800138000
登录密码：123456 / 123456a

## 启动项目

``` bash
# clone the projice
git clone git@gitlab.gzleihou.cn:root/so-superadmin.git

# install dependencies
npm install

## develop
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 许可证
Copyright © 2018 广州雷猴软件开发有限公司