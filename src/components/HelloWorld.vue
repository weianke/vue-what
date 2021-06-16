<template>
  <div class="hello">
    <div class="login-wrap" v-if="!isCheckin">
      <div class="login-con">
        <h3>用户登录</h3>
        <input type="text" placeholder="请输入昵称" id="loginName" v-model.trim="uname" @keyup.13="login" />
        <button class="login-btn" @click="login">登录</button>
      </div>
    </div>

    <div class="chat-wrap " v-else>
      <h1>多人聊天室（总人数：{{ amount }}）</h1>
      <div class="chat-con clearfix" id="chat_con">
        <div v-for="item in msgList" :key="item.id">
          <!-- {{item | json}} -->
          <template v-if="item.msgType == 0">
            <p>{{ item.message }}</p>
            <br />
          </template>

          <template v-else>
            <div class="chat-item item-right clearfix" v-if="uname == item.username">
              <span class="img fr"></span><span class="message fr">{{ item.message }}</span>
            </div>
            <div class="chat-item item-left clearfix rela" v-else>
              <span class="abs uname">{{ item.username }} ( {{ item.msgDate | formatDate }} )</span><span class="img fl"></span
              ><span class="fl message">{{ item.message }}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="bottom">
        <input type="text" id="sendtxt" v-model.trim="inputMsg" @keyup.13="sendMessage" />
        <button class="sendBtn" @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '欢迎光临',
      smount: 0,
      uname: '哈哈',
      inputMsg: '',
      socket: null,
      isCheckin: false,
      msgList: []
    }
  },
  sockets: {
    // 链接成功
    connect (data) {
      console.log(data)
    },
    // 发送消息
    toServer (data) {
      this.$socket.emit('toServer', data)
    },
    // 接收消息
    toClient (data) {
      this.msgList.push(data)
    },
    // 断开链接回调
    disconnect () {
      console.log('disconnect：', '已经断开 socket 链接')
    },
    // 重新连接
    reconnect () {
      // 自动执行，直到链接成功
      this.$socket.emit('connect')
    }
  },
  mounted () {
    // console.log(this);
    // console.log(this.$socket);

    this.sockets.subscribe('loginSuccess', function (data) {
      if (data.username === this.uname) {
        // this.checkin(data)
        this.isCheckin = true;
      } else {
        alert('用户名不匹配，请重试')
      }
    })

    /*登录失败*/
    this.sockets.subscribe('loginFail', function () {
      alert('昵称重复')
    })

    /*监听人数*/
    this.sockets.subscribe('amountChange', function (data) {
      this.amount = data
    })



    /*接收消息*/
    this.sockets.subscribe('receiveMessage', function (data) {
      console.log('接收到服务端返回：', data)
      this.msgList.push(data);
    })
  },
  filters: {
    formatDate: function (data) {
      const date = data ? new Date(data) : new Date();
      const time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
      return time;
    }
  },
  methods: {
    /*登录*/
    login () {

      if (this.uname) {
        /*向服务端发送登录事件*/
        this.$socket.emit('login', { username: this.uname })
      } else {
        alert('请输入昵称')
      }
    },
    /*发送消息*/
    sendMessage () {
      if (this.inputMsg) {
        this.$socket.emit('sendMessage', { username: this.uname, message: this.inputMsg });
        this.inputMsg = '';
      } else {
        alert('请输入……')
      }
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
