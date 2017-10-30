<template>
  <div id="app">
  	<div v-if="route">
  	  <user-nav :loginResult='loginResult' @changeRoute='changeRoute'></user-nav>
  	</div>
    <!--<img src="./assets/logo.png">-->
    <div class="router">
    	<router-view @setLoginInfo='getLoginInfo' @getLocalStorage='getLocalStorage' @changeRoute='changeRoute'></router-view>
    </div>
  </div>
</template>

<script>
import config from '@/components/config'
import userNav from '@/components/user-nav'
export default { // todo,在app.vue里1：拼写nav，2：从localStorage获取用户信息
  name: 'app',
  data () {
    return {
      loginResult: '',
      route: true
    }
  },
  components: {
    config,
    userNav
  },
  mounted () {
    this.$nextTick(() => {
      this.getLocalStorage()
    })
  },
  methods: {
    getLocalStorage () { // 每次刷新页面或者页面跳转到登入页面（不论最终是否停留在登入页面），都会进入这个方法
      console.log('从localStroage里面取得的值：' + config.getStorage('loginResult'))
      this.loginResult = config.getStorage('loginResult')
    },
    getLoginInfo (result) { // 通过登入接口传来的登入信息
      console.log('登入成功传入的result：' + result)
      this.loginResult = result
    },
    changeRoute (route) {
      console.log(route)
      if (route.path === '/') {
        this.route = false
      } else {
        this.route = true
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  position: relative;
}
html,body {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
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
  display: inline-block;
  text-decoration: none;
}
.router{
  padding: 40px 20px 0 20px;
  position: relative;
  top: 95px;
  height: 100%;
  min-width: 1250px;
}
.router{
  background: #fafbff;
}
.search {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #b4c8ed;
  background-color: #f0f4fa;
  padding: 0 0 10px 0;
  text-align: left;
  width: 100%;
}
.search div{
	margin: 10px 0 0 20px;
	display: inline-block;
}
.search div input{
	width: 152px;
	height: 28px;
	padding: 0 0 0 20px;
	border-radius: 3px;
	font-size: 16px;
	line-height: 28px;
}
.search div input[type="radio"]{
  width: auto;
  height: 20px;
}
.calender-div{
  background: #fff;
}
.calender-div div{
  display: block;
  margin: 0;
}
.search div select{
	width: 174px;
	height: 30px;
	padding-left: 20px;
	border-radius: 3px;
	font-size: 16px;
}
.btn-lg{
	display: inline-block;
  height: 30px;
  width: 150px;
  border-radius: 5px;
 	border: 1px solid;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
.btn-md{
	display: inline-block;
  height: 27px;
  width: 100px;
  border-radius: 5px;
 	border: 1px solid;
  text-align: center;
  line-height: 27px;
  cursor: pointer;
}
.btn-sm{
	display: inline-block;
  height: 24px;
  width: 45px;
  border-radius: 5px;
  border: 1px solid;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
  font-size: 14px;
}
.btn-info{
	color: #fff;
	background-color: #5bc0de;
  border-color: #46b8da;
}
.btn-success{
	color: #fff;
	background-color: #5cb85c;
  border-color: #5cb85c;
}
.btn-danger{
	color: #fff;
	background-color: #d9534f;
  border-color: #d43f3a;
}
.btn-table{
	color: #fff;
	height: 23px;
	line-height: 26px;
}
.btn-primary{
	color: #fff;
	background-color: #337ab7;
	border-color: #2e6da4;
}
.btn-default{
	color: #333;
	background-color: #fff;
	border-color: #ccc;
}
.err-msg{
	display: inline-block;
	color: red;
	position: relative;
}
.msg{
	display: inline-block;
	position: relative;
}
.modal-backdrop{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  background-color: #7d7d7d;
  opacity: .8;
}
legend{
	padding: 20px 0 10px 20px ;
	text-align: left;
	border-bottom: 1px solid #ccc;
}
legend div{
	display: inline-block;
	margin-right: 20px;
}
legend select,legend input{
	padding: 0 0 0 10px;
	border: 1px solid #ccc;
	font-size: 16px;
}
legend select{
	height: 27px;
}
legend input{
	height: 25px;
	width: 100px;
}
.table{
	line-height: 26px;
	padding-bottom: 25px;
	text-align: left;
}
.table tr:hover{
	background: #e9e9e9;
}
.table tr:nth-child(2n+1) {
  background-color: #ebf2ff;
}
.table tr {
  background-color: #f7faff;
}
.table thead th{
	/*border: 1px solid #2c3a54;*/
	border: 1px solid #3f6c8d;
	height: 27px;
}
.table tr td{
	border: 1px solid #b4caed;
	padding: 2px;
}
.table table thead{
	background-color: #337AB7;
	color: #ffffff;
}
.table-hover{
	border-collapse: collapse;
	text-align: center;
}
.popup{ /*弹框样式*/
  display: inline-block;
  z-index: 1050;
  background: #fff;
  position: fixed;
  text-align: left;
  box-shadow:  0 3px 10px #101010;
}
.popup title{ /*弹框title样式*/
  margin: 10px 0 10px 20px;
  display: inline-block;
  font-weight: bold;
}
.popup legend{
  border-bottom: 1px solid #ccc;
  padding: 0;
  width: 100%;
}
.popup label{
  width: 100px;
}
.tdRight {
  text-align: right;
  width: 110px;
  vertical-align: bottom;
}
textarea{
  vertical-align: bottom;
}
.tdLeft {
  text-align: left;
}
input,select,textarea{
	border-radius: 3px;
	padding-left: 10px;
	border-style: none;
	border: 1px solid #ccc;
	font-size: 16px;
}
.head div{
	background-color: #518cb8;
	color: white;
	font-size: 20px;
	height: 32px;
}
.popup .head {
  background-color: #518cb8;
  padding-bottom: 5px;
  padding-top: 5px;
  color: #ffffff;
  position: fixed;
  width: 600px;
  height: 20px;
  z-index: 1;
  margin-top: -25px;
}
.popup .img-head {
  background-color: #518cb8;
  padding-bottom: 5px;
  padding-top: 5px;
  color: #ffffff;
  height: 20px;
  z-index: 1050;
  margin-top: -25px;
}
footer{
  position: fixed;
  width: 590px;
  bottom: 0;
  padding: 5px;
  box-shadow: 0 0px 2px #ccc;
  margin: 0;
  background: #fff;
}
[class^="icon-"], [class*=" icon-"] {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-top: 1px;
  line-height: 14px;
  vertical-align: text-top;
  background-position: 14px 14px;
  background-repeat: no-repeat;
}
.icon-remove {
  background-position: -312px 0;
  right: 10px;
  top: 6px;
  position: absolute;
  cursor: pointer;
}
.icon-white{
	background-image: url(/static/glyphicons-halflings-white.png);
}
.icon-black{
	background-image: url(/static/glyphicons-halflings.png);
}
.tableActive{
	background: #ccc !important;
}
.popup legend title{
	font-size: 18px;
	font-weight: bold;
}
.popup input{
	width: 419px;
	height: 22px;
	padding: 0 0 0 10px;
	font-size: 16px;
	margin-top: 8px;
}
.popup select{
	width: 161px;
	height: 24px;
	padding: 0 0 0 10px;
	font-size: 16px;
	margin-top: 8px;
}
.hide{
	display: none;
}
.drop-container{
  width: 88px !important;
  height: 48px;
  padding-top: 40px;
  top: 0px;
  left: -42px;
  display: inline-block;
  border: 1px solid;
  font-size: 14px;
  color: #999;
  text-align: center;
  margin: 5px;
  cursor: pointer;
}
.category, .vdp-datepicker, .vdp-datepicker div{
  margin: 0 !important;
}
input[name='validFrom'], input[name='validTo'], input[name='from'], input[name='to'] {
  top: 1px;
  position: relative;
}
input[type="radio"]{
  width: auto;
  position: relative;
  top: 6px;
}
.addTrainNo:before{
	border-top: 4px solid;
	content:"";
	display: block;
	position: relative;
	width: 16px;
	top: 13px;
	left: 7px;
}
.addTrainNo{
	/*background: url(../../../img/add.png);*/
	background-repeat: no-repeat;
	display: inline-block;
	width: 30px;
	cursor: pointer;
	top: -53px;
	left: 24px;
	height: 30px;
	position: relative;
	border: 2px solid;
	border-radius:20px ;
	color: #CCC;
}
.addTrainNo:after{
	border-left:4px solid;
	content:"";
	display: inline-block;
	position: relative;
	top: 3px;
  left: 13px;
	height: 16px;
}
.addTrainNo:hover{
	color: #69c;
}
.time-pick div{
  margin: 0;
}
.time-pick div input{
  min-width: 152px;
  padding: 0 0 0 20px;
}
/*.time-pick td div div input{
  padding: 0 0 0 20px;
  width: 148px !important;
}*/
.calender-div{
  z-index: 1;
}
.vdp-datepicker div input{
  min-width: 90px;
  width: 90px;
  padding-left: 0;
}
::-webkit-scrollbar {/*隐藏滚轮*/
  width: 0;
}
.vdp-datepicker{
  display: inline-block;
}
.vdp-datepicker div{
  display: inline-block;
}
input[type='checkbox']{
  width: auto;
}
td img{
  margin: 8px;
  border: 1px solid #9D9D9D;
}
.btn-left{
  margin-right: 2px;
}
.high-light{
	color: red;
}
</style>
