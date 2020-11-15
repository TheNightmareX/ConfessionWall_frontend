# 表白墙-前端

这是受到[我同学](https://github.com/jsun969)部署的[另一个表白墙项目](https://github.com/ping-xiong/saylovewall)启发，模仿着写的第一个 Vue 项目  
相当不成熟，如果你发现当前 commit 中有迷惑行为，欢迎通过 issue 告知

版本号为 API 版本号，如：v1.2.x 的前端只能使用 v1.2.x 的后端

未写任何防御，求别攻击演示站点……

## 前端部署(Windows 下开发部署)

```
npm i
npm run serve
```

前后端全部部署完毕后即可访问[用户入口](http://localhost:8080)和[管理员登陆入口](http://localhost:8080/login)

## 规则

通过`localStorage`限制每个浏览器表白一次，给每条表白点一个赞，给每条表白评论一次  
管理员无限制，并可删除表白和评论
管理员可通过调用`window.storage.reset()`重置`localStorage`