# 组队平台

## 目录结构

+ admin 管理员后端
+ adminAnt 打算用 ant design 写的管理员后端
+ clinet 客户端
+ database 数据库
+ server 服务端
+ server0.1 v0.1的服务端备份
+ serverPro 用于生产环境的代码
+ static 静态文件，主要是开发阶段使用
+ wechat 微信端

## Branches

1. 在 master 分支进行开发。
1. 开发完成之后，合并到 v0.2。
1. 然后用 v0.2 进行部署。
1. 若 v0.2 出现致命 BUG ，则迅速切换到 v0.1，部署 v0.1 之后，再 DEBUG

#### 分支简介

+ master 主分支，用于开发
+ v0.1 完成基本功能
  - 组队平台 0.1
  - 考表查询
  > 部署方法:
  > git pull https://git.coding.net/nodejh/scu_group.git v0.1
  > cd serverPro
  > pm2 start bin/www --name groupServer # 组队平台
  > cd ../wechat
  > pm2 start bin/www --name wechatServer # 微信服务
+ v0.2  


## 微服务

将大的项目解耦成很多微服务，每个服务单独部署，互不影响。

#### v0.1

+ 微信菜单创建和微信事件处理
  > 创建微信菜单，并处理用户在微信工作平台产生的事件，比如点击某个菜单/回复某个关键词
+ 组队平台

#### v0.2

主要是将微信菜单创建和微信事件处理解耦并开发商户平台功能。

+ 微信菜单创建 WechatMenu
  > cd WechatMenu
  > npm i
  > node app.js
+ 微信服务端 WechatServer
  > 处理用户在微信工作平台产生的事件，比如点击某个菜单/回复某个关键词
  > 教务系统绑定
+ 组队平台
+ 组队平台后端（尚未开发）
+ 商家后端（尚未开发）



## 开发实践

+ ~~当前用户信息从session中取得~~
+ 某个用户信息，从数据库查询


## 数据导入导出

```
mongoexport --db scuGroup --collection users --out users20161202.json
mongoexport --db scuGroup --collection news --out news20161202.json
```

```
mongoimport --db scuGroup --collection news --file 20161123news.json
mongoimport --db scuGroup --collection users --file 20161123users.json
```

## 路由

+ /wechat 微信相关，如自动回复等
+ /api/* API
+ /*  ==> index.html

## 端口

#### 开发

+ client 3000
+ server 3001
+ wechat 3333

#### 部署

+ server 3001
+ wechat 3333

#### 微信

+ group ===> 3001
+ groupwechat ===> 3333

## 错误处理

+ ~~前端 Promise resolve() 直接返回所需数据(string/object/number/...)~~
+ ~~前端 Promise reject() 直接返回所需数据(string)~~

+ Promise resolve() 直接返回所需数据(string/object/number/...)
+ Promise reject() 返回对象(code, message)

## BUG

+ ~~加入活动报错~~ *(2016.12.20)*


## TODO

+ ~~mongodb exec()~~
  > 创建 mongodb 集合的实例时，直接将实例返回。在某个数据库操作时使用 exec() 返回一个 promise  *(2016.12.20)*
+ ~~mongoDB 大小写问题~~
  > 将 mongodb collection 改为下划线命名 *(2016.12.20)*
+ 分页
+ 将登录解耦
+ 使用 token 进行身份认证
