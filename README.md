# chatroom-vue
一个简单的多人聊天室demo。基于vue和node + vue-Socket

## 如何运行

进入到目录安装依赖包
```
 npm install
```

启动server服务（称这个终端为S终端，得先启动后台服务，否则前端页面无法成功连接Socket），在执行以下命令后，成功执行会终端会提示'app listen at：9000'
```
 npm run server
```

另起窗口（注意：是另起窗口！），启动前端开发服务（称这个终端为B终端），在chatroom-vue目录里执行以下命令，成功执行后，在浏览器输入访问地址`http://localhost:8080`
```
 npm run dev
```