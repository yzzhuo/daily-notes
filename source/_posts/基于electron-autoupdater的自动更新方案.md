---
title: 基于electron-autoupdater的自动更新方案
date: 2018-03-14 22:45:13
tags:
---

此教程是基于electron-autoupdater的自动更新方案。研究了一下electron文档原生的autoUpdater模块和elecrtron-builder配套的autoUpdater，最终选择后者是因为实现起来简单太多，而且在macOS和win的实现也是一致的。

#### 目标效果

应用打开的时候自动检测当前是否是最新版本，如果不是，提示用户是否更新，用户确认更新后，会自动去下载最新的安装包，下载完成后提示用户是否重新启动打开最新版本的客户端。

#### 实现步骤

1. 在项目中安装electron-updater这个依赖。

2. 在main.js中引入下面代码：

   ```javascript
   const {autoUpdater} = require("electron-updater");
   const {app, dialog } = require('electron');

   // 检测当前是否是最新版本
   autoUpdater.on('update-available', (ev, info) => {
     dialog.showMessageBox({
       type: 'info',
       title: 'Found Updates',
       message: 'Found updates, do you want update now?',
       buttons: ['Sure', 'No']
     }, (buttonIndex) => {
       if (buttonIndex === 0) {
         // 下载最新的安装包
         autoUpdater.downloadUpdate()
       }
     });
   })
   // 自动更新异常处理
   autoUpdater.on('error', (ev, err) => {
     console.log('Error in auto-updater.');
   })
   //开始下载安装包检测
   autoUpdater.on('download-progress', (ev, progressObj) => {
     console.log('Download progress...');
   })
   // 安装完成后
   autoUpdater.on('update-downloaded', (ev, info) => {
     dialog.showMessageBox({
       title: 'Install Updates',
       message: 'Updates downloaded, application will be quit for update...'
     }, () => {
       setImmediate(() => autoUpdater.quitAndInstall())
     })
   });
   app.on('ready', function()  {
     // ....
     // 启动自动检测版本
     autoUpdater.checkForUpdates();
   });
   ```

3. 配置package.json，在build字段里面增加publish字段，其中的url是安装包和记录了当前最新版本的json/yml文件。

   ```json
   "build": {
     ...
       "publish": [
         {
           "provider": "generic",
           "url": "https://localhost:8080/releases"
         }
       ],
   }
   ```

4. 用electron-builder打包出安装包等文件到dist目录，dist目录大致包括下列文件

   ```
   --dist
    client-1.2.1.dmg
    client-1.2.1-mac.zip
    lastest-mac.json
    lastest-mac.yml
    client-1.2.1.exe
   ```

5. 将上面展示的dist目录下的资源放在在静态服务器上，使得可以通过第三步设置的seedUrl能够访问到dist里面的文件。



#### 测试步骤

1. 先打包一个安装包
2. 升级版本号，再打一个安装包
3. 更新静态资源服务器上的文件，把第二部打包出来的东西上传到服务器上
4. 安装第一步的安装包，打开显示有版本更新，能够下载最新安装包和安装重启就大功告成了～



#### 其他注意要点

1. 若是直接用`electron`命令启动客户端，会报autoupdater根目录缺少dev-app-update.yml的错，需要自己手动在根目录加上：

   ```
   version: 1.X.X
   provider: generic
   url: seedURL
   ```

2. 直接用electron启动客户端测试更新的话，mac会包codesiging的错误，具体可以看https://github.com/electron/electron/issues/7476。（因为我懒，没有去弄，直接打包进行测试也是妥妥的）



更多信息请看文档：https://www.electron.build/auto-update