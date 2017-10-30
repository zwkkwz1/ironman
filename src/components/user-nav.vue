<template>
<div v-if="this.$route.name !== 'login'" class="all-nav">
  <div class="head">
	  <img src="../../static/logo.png" alt="上海帝仪" />
	  <div class="right-nav">
	    <span>{{'欢迎！' + this.loginResult.name}}</span>
	    <span @click="logout">注销</span>
	  </div>
  </div>
  <div class="nav">
    <nav class="nav-class">
      <div class="nav-div" v-for="lvl in loginResult.privileges">
        <a href="javascript:void(0)" class="">
          <span v-text="lvl.pathName"></span>
        </a>
        <ul class="lvl2-nav hide">
          <li v-for="lvl2 in lvl.children">
            <a :href="lvl2.path">
              <span v-text="lvl2.pathName"></span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
  <div class="line"></div>
  <div class="title" v-text="this.$route.name"></div>
</div>
</template>

<script>
import config from '@/components/config'
export default {
  data () {
    return {
      navHtml: '',
      isLogin: true
    }
  },
  props: ['loginResult'],
  mounted () {
    this.$nextTick(() => {
      console.log(this.loginResult)
    })
  },
  watch: {
    loginResult: 'splitJointNav',
    $route: 'changeRoute'
  },
  methods: {
//  splitJointNav () { // 通过登入信息拼写导航栏
//    this.navHtml = ''
//    for (var i = 0; i < this.loginResult.privileges.length; i++) {
//      this.navHtml += `
//        <a href="${this.loginResult.privileges[i].path}" class="${this.loginResult.privileges[i].imageUri}">
//          <span style="margin-right: 20px;">${this.loginResult.privileges[i].name}</span>
//        </a>
//      `
//    }
//  },
    logout () { // 登出
      config.delCookie('accessToken')
      localStorage.clear()
      this.$router.push({path: '/'})
      let accessToken = config.getCookie('accessToken')
      this.axios.defaults.headers.get['accessToken'] = this.axios.defaults.headers.post['accessToken'] = accessToken
    },
    changeRoute () {
      console.error('没有错：+route' + this.$route)
      this.$emit('changeRoute', this.$route)
    }
  }
}
</script>

<style scoped>
.all-nav{
  position: fixed;
  width: 100%;
  z-index: 1000;
  top: 0;
}
.head{
  position: relative;
  height: 60px;
  background: #337AB7;
}
.head img{
  position: absolute;
  left: 20px;
  top: 9.5px;
}
.right-nav{
  font-size: 14px;
  display: inline-block;
  background: none;
  position: absolute;
  color: #fff;
  right: 0;
  height: 60px;
  line-height: 60px;
}
.right-nav span{
  margin-right: 20px;
}
.line{
  height: 3px;
  background: -webkit-linear-gradient(#ffb420, #f5c25e); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#ffb420, #f5c25e); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#ffb420, #f5c25e); /* Firefox 3.6 - 15 */
  background: linear-gradient(#ffb420, #f5c25e); /* 标准的语法 */
}
div{
  color: #999;
}
nav{
  display: inline-block;
  position: relative;
  text-align: left;
}
.nav-class{
  text-align: center;
}
a{
  color: #333;
  width: 138px !important;
  /*border-right: 1px solid #ccc;*/
}
a:hover{
  color: #337AB7;
  background: #e6e6e6;
}
.nav-class a{
  width: auto;
}
ul{
  margin: 0;
  border: 1px solid #ccc;
  border-top: none;
  box-shadow: 0px 3px 3px #888;
}
li{
  display: block;
  margin: 0;
  line-height: 30px;
  font-size: 16px;
}
span{
  position: relative;
  cursor: pointer;
}
.nav-div{
  display: inline-block;
  width: 140px;
  background: #fff;
  vertical-align: top;
}
.nav-div:hover > .lvl2-nav{
  display: block;
  z-index: 111111111111;
}
.nav{
  background: #fff;
  border-bottom: 1px solid #ccc;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  text-align: left;
}
.title{
  font-size: 14px;
  line-height: 22px;
  color: #333;
  background: #e6e6e6;
  background: -webkit-linear-gradient(#e7e2d8, #dfe0e6); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#e7e2d8, #dfe0e6); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#e7e2d8, #dfe0e6); /* Firefox 3.6 - 15 */
  background: linear-gradient(#e7e2d8, #dfe0e6); /* 标准的语法 */
  padding-left: 20px;
  text-align: left;
}
</style>