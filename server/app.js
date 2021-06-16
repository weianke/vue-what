var app = require('http').createServer();
var io = require('socket.io')(app);
var PORT = 9000;
// 用户数组
var users = [];

io.on('connection', function(socket) {
  // 新用户标识
  var isNewPerson = true;
  // 当前登陆用户
  var username = null;
  // 登陆监听
  socket.on('login', function(data) {
    for (var i = 0; i < users.lengtht; i++) {
      if (users[i].username === data.username) {
        isNewPerson = false;
        break;
      } else {
        isNewPerson = true;
      }
    }

    // 确定登陆后
    if (isNewPerson) {
      username = data.username;
      users.push({
        username: data.username,
      });

      let resdata = {
        msgType: 0,
        msgDate: new Date(),
        message: '系统消息：' + data.username + '已加入群聊',
      };

      // 登陆成功
      socket.emit('loginSuccess', {
        username: data.username,
      });

      // 向所有连接的客户端广播事件
      io.sockets.emit('receiveMessage', resdata);

      console.log('登陆成功：', resdata);

      // 向所有连接的客户端广播在线人数
      io.sockets.emit('amountChange', users.length);

      console.log('聊天室人数：', users.length);
    } else {
      // 登陆失败
      socket.emit('loginFail', '登陆失败');
    }
  });

  // 监听发送消息
  socket.on('sendMessage', function(data) {
    let resdata = {
      username: data.username,
      msgType: 1,
      msgDate: new Date(),
      message: data.message,
    };

    io.sockets.emit('receiveMessage', resdata);
  });

  /* 退出登录 */
  socket.on('disconnect', function() {
    // username  为13行的当前登录用户。也可前端传参进来主动触发
    let resdata = {
      // username: username,
      msgType: 0,
      msgDate: new Date(),
      message: '系统消息：' + username + '已退出群聊',
    };
    io.sockets.emit('receiveMessage', resdata);

    console.log('退出===', username);

    /* 向所有连接的客户端广播leave事件 */
    io.sockets.emit('leave', username);
    users.map(function(val, index) {
      if (val.username === username) {
        users.splice(index, 1);
      }
      /* 人数变更，广播给所有连接用户 */
      console.log('当前连接的用户为：', users);
      io.sockets.emit('amountChange', users.length);
    });
  });
});


app.listen(PORT, () => {
  console.log('server is running  9000...');
});