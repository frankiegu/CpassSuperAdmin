# so-superadmin 智众总后台管理前端项目

## 相关文档

[接口文档](http://doc.tt.gzleihou.cn/index.php?s=/10&page_id=418)：http://doc.tt.gzleihou.cn/index.php?s=/10&page_id=418

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

[测试环境](http://so-superadmin.tunnel.gzleihou.cn/#/client/list)：http://so-superadmin.tunnel.gzleihou.cn/#/client/list

[UAT环境](http://superadmin.uat.gzleihou.cn)：http://superadmin.uat.gzleihou.cn

[正式环境](http://superadmin.gzleihou.cn)：http://superadmin.gzleihou.cn

### 注意

``` bash
1. 全局（使用不止一处）用到的地方、js(mixins)、布局（style）等，尽量做成全局
2. 命名，以功能 起什么作用来命名，样式、组件、js（因为今后难免会调整，这样写今后有悔改的机会）
   - good: medium small mini
   - bad:  16 14 12 
3. 使用公共变量，今后调整的时候只修改一处即可，不用改一个小功能就要设计几十上百的地方
4. .vue顶级样式命名区分，以固定名称开头，页面(page-)、组件(components- | module- | template-)
5. views、router、service模块文件一一对应，接口不要错乱，避免重复、冗余

> 最后，时时勤拂拭，勿让惹尘埃，共勉
```

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