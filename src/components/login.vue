<template>
  <div class="login">
  	<div class="login-div">
  	  <div class="err-msg" v-text="errMsg" style="top: 17px;"></div>
  	  <p>
  	    <span class="username-icon login-username"></span>
  	  </p>
	  <input placeholder="请输入登入账号" type="text" name="username" id="username" v-model="loginVo.username" />
	  <p>
	    <span class="password-icon login-password"></span>
	    <input placeholder="请输入密码" type="text" name="password" id="password" v-model="loginVo.password" v-show="eyesOpen"/>
	    <input placeholder="请输入密码" type="password" name="password" id="password" v-model="loginVo.password" v-show="!eyesOpen"/>
	    <span class="password-eyes" :class="{ passwordIconEyesOpen: eyesOpen, passwordIconEyesClose: !eyesOpen }" @click="eyesToggle"></span>
	  </p>
	  <div class="img-identify">
	    <input placeholder="请输入图形验证码" type="text" name="identifyingCode" id="identifyingCode" v-model="loginVo.code"/>
	    <img :src="imageUrl" alt="司机健康，图形验证码" onerror="" @click="captchaCreate" />
	  </div>
	  <div class="btn-lg btn-primary btn" @click="login">登  录</div>
  	</div>
  </div>
</template>

<script>
import config from '@/components/config'
export default {
  name: 'login',
  data () {
    return {
      msg: 'login!!!',
      imageUrl: '',
      errMsg: '',
      eyesOpen: false,
      imgOnerror: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504762603437&di=60a979d4c5169ecf9309b63fd63fa870&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D1002907359%2C3496940718%26fm%3D214%26gp%3D0.jpg',
      imgOnload: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504762603437&di=60a979d4c5169ecf9309b63fd63fa870&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D1002907359%2C3496940718%26fm%3D214%26gp%3D0.jpg',
      loginVo: {}
    }
  },
  props: ['popup'],
  mounted () {
    this.$nextTick(() => {
      this.eyesOpen = false // 默认状态，密码不显示
      let accessToken = config.getCookie('accessToken')
      this.axios.defaults.headers.get['accessToken'] = this.axios.defaults.headers.post['accessToken'] = accessToken // 从cookie里面拿 token
      this.$emit('getLocalStorage') // 从localStorage里面拿菜单栏
      console.log('token是' + this.axios.defaults.headers.get['accessToken'])
      if (this.axios.defaults.headers.get['accessToken'] && !this.popup) { // 如果存在token，跳过登入过程
        console.log('存在token')
        this.$router.push({path: '/order'})
        this.$emit('changeRoute', this.$router)
        return null
      }
      console.log('检查token之后') // token不存在
      localStorage.clear() // 清空localstorage
      this.$emit('setLoginInfo', '') // 清空菜单栏
      this.captchaCreate() // 获取图形验证码
      document.onkeydown = (evt) => {
        let key
        if (window.event) { // IE/Chrome/Opera(新版本)
          key = evt.keyCode
        } else if (evt.which) { // Netscape/Firefox/Opera/Chrome/IE（新版本）
          key = evt.which
        }
        if (key === 13) {
          this.login()
        }
      }
    })
  },
  methods: {
    login () { // 登入
      if (!this.loginVo.username) {
        this.errMsg = '请输入登入账号'
        this.hideMsg()
        return null
      } else if (!this.loginVo.password) {
        this.errMsg = '请输入密码'
        this.hideMsg()
        return null
      } else if (!this.loginVo.code) {
        this.errMsg = '请输入图形验证码'
        this.hideMsg()
        return null
      }
      const loginVo = this.loginVo
      this.captchaCreate() // 清空用户名密码。获取新的图形验证码
      this.axios({
        method: 'post',
        url: '/sys/user/login',
        data: loginVo
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.loginVo.username = ''
          this.loginVo.password = ''
          console.log('登入成功')
          document.cookie = 'accessToken=' + data.result.token
          this.axios.defaults.headers.get['accessToken'] = this.axios.defaults.headers.post['accessToken'] = data.result.token // 设置accessToken的cookie
          // todo： 将登入信息localstorage
          let result = data.result
//        let result = { // 假数据
//          'username': 'inettest',
//          'name': '测试用户',
//          'mail': 'inettest@deayea.com',
//          'loginAt': '2017-08-08 22:16:08',
//          'token': '661cb65a-1755-4938-a95c-08f9e69bf485',
//          'groups': [
//            'ironman-user',
//            'ironman-admin'
//          ],
//          'privileges': [{
//            'code': 'FST00002',
//            'name': '字典管理',
//            'category': 1,
//            'path': '#/sys-config',
//            'pathName': 'sysConfig',
//            'relatedView': '@/components/sys-config',
//            'relatedViewComponent': 'sysConfig',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }, {
//            'code': 'FST000011',
//            'name': '图片上传',
//            'category': 1,
//            'path': '#/img-upload',
//            'pathName': 'orderAdmin',
//            'relatedView': '@/components/order',
//            'relatedViewComponent': 'orderAdmin',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }, {
//            'code': 'FST00003',
//            'name': '商品管理',
//            'category': 1,
//            'path': '#/commodity-admin',
//            'pathName': 'commodityAdmin',
//            'relatedView': '@/components/commodity-admin',
//            'relatedViewComponent': 'commodityAdmin',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }, {
//            'code': 'FST00004',
//            'name': '商品分类',
//            'category': 1,
//            'path': '#/commodity-classification',
//            'pathName': 'commodityClassification',
//            'relatedView': '@/components/commodity-classification',
//            'relatedViewComponent': 'commodityClassification',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }, {
//            'code': 'FST00005',
//            'name': '用户积分',
//            'category': 1,
//            'path': '#/user-points',
//            'pathName': 'userPoints',
//            'relatedView': '@/components/user-points',
//            'relatedViewComponent': 'userPoints',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }, {
//            'code': 'FST00006',
//            'name': '字典分类',
//            'category': 1,
//            'path': '#/sys-group',
//            'pathName': 'sysGroup',
//            'relatedView': '@/components/sys-config-group',
//            'relatedViewComponent': 'sysGroup',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }, {
//            'code': 'FST00007',
//            'name': '订单',
//            'category': 1,
//            'path': '#/order',
//            'pathName': 'order',
//            'relatedView': '@/components/order',
//            'relatedViewComponent': 'order',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }, {
//            'code': 'FST00008',
//            'name': '资讯',
//            'category': 1,
//            'path': '#/information',
//            'pathName': 'information',
//            'relatedView': '@/components/consult',
//            'relatedViewComponent': 'information',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }, {
//            'code': 'FST00009',
//            'name': '积分规则',
//            'category': 1,
//            'path': '#/points-rule-conf',
//            'pathName': '积分规则管理',
//            'relatedView': '@/components/points-rule-conf',
//            'relatedViewComponent': 'pointsRuleConf',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }, {
//            'code': 'FST000010',
//            'name': '经验值历史',
//            'category': 1,
//            'path': '#/user-experience',
//            'pathName': '经验值历史',
//            'relatedView': '@/components/user-experience',
//            'relatedViewComponent': 'userExperience',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }, {
//            'code': 'FST000013',
//            'name': '用户组管理',
//            'category': 1,
//            'path': '#/user-group',
//            'pathName': '用户组管理',
//            'relatedView': '@/components/user-group',
//            'relatedViewComponent': 'userGroup',
//            'level': 1,
//            'hasChild': false,
//            'imageUri': 'sc-icon',
//            'parentSid': 0
//          }]
//        }
          this.$emit('setLoginInfo', result) // 将loginInfo传给App.vue
          localStorage.setItem('loginResult', JSON.stringify(result))
          if (!this.popup) {
            this.$router.push({path: '/order'}) // 如果不是弹框的登入框
            this.$emit('changeRoute', this.$router)
          } else {
            console.log('准备将result传入父组件')
            this.$emit('loginSuccess', result) // 将登入信息传入login-popup组件内，等待父组件将信息转发出去
          }
        } else {
          this.errMsg = data.msg
          this.hideMsg()
        }
      }).catch((error) => {
        this.errMsg = error
        this.hideMsg()
      })
    },
    captchaCreate () { // 获取验证图片
      this.axios({
        method: 'get',
        url: '/captcha/create'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.loginVo.sequence = data.result.key
          this.imageUrl = data.result.imageUrl
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    eyesToggle () { // 账号密码显示隐藏
      this.eyesOpen = !this.eyesOpen
    },
    hideMsg () {
      clearTimeout(this.msgHide)
      this.msgHide = setTimeout(() => {
        this.errMsg = ''
      }, 5000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}
p{
  margin: 0;
}
.login {
  text-align: center;
  height: 120%;
  position: relative;
  margin-top: -135px;
  background: url(../../static/login-bg.png);
}
.login-div{
  width: 332px;
  display: inline-block;
  text-align: left;
  position: relative;
  margin-top: 12%;
}
.login-div input{
  width: 300px;
  height: 35px;
  font-size: 14px;
  margin-top: 20px;
  padding-left: 30px;
  border: 1px solid #ccc;
  background: #fff !important;
}
.login-div p{
  position: relative;
}
.username-icon{
  background: url(../../static/login_icon.png) -5px -6px no-repeat;
  width: 25px;
  height: 35px;
}
.login-username{
  display: inline-block;
  position: absolute;
  top: 21px;
  left: 1px;
}
.password-icon{
  background: url(../../static/login_icon.png) -31px -6px no-repeat;
  width: 25px;
  height: 35px;
}
.login-password{
  display: inline-block;
  position: absolute;
  top: 21px;
  left: 1px;
  z-index: 2;
}
.password-eyes{
  display: inline-block;
  position: absolute;
  top: 21px;
  right: 1px;
}
.passwordIconEyesOpen{
  background: url(../../static/login-icon.png) -236px -99px no-repeat;
  width: 25px;
  height: 35px;
}
.passwordIconEyesClose{
  background: url(../../static/login-icon.png) -236px -132px no-repeat;
  width: 25px;
  height: 35px;
}
.img-identify{
  position: relative;
}
.img-identify img{
  display: inline-block;
  position: absolute;
  right: 3px;
  top: 26px;
  cursor: pointer;
}
.login-div .btn{
  height: 40px;
  width: 100%;
  margin-top: 40px;
  border-radius: 0;
  line-height: 40px;
  font-size: 18px;
  font-family: "微软雅黑",Arial;
}
img{
  margin: 0;
}
</style>
