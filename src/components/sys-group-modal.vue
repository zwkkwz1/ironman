<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div v-drag class="popup" style="height: 230px;width: 600px;">
    <div class="head" style="text-align: center;width: 600px;">
      <h3></h3>
        <i class="icon-remove icon-white" @click="cancelEdit()"></i>			  	
	  </div>
  	<legend>
  	  <title style="width: 100%;">字典分类信息</title>
  	</legend>
  	<table>
  	  <tr>
  	    <td class="tdRight" for="code">分类编码:</td>
  	    <td>
  	      <span v-if="params.sid" v-text="params.code"></span>
  	      <input type="text" v-if="!params.sid" v-model="params.code" />
  	      <span class="high-light">*</span>
  	    </td>
   	  </tr>
  	  <tr>
  	    <td class="tdRight" for="name">分类名称:</td>
  	    <td>
  	      <input type="text" name="name" v-model="params.name" />
  	      <span class="high-light">*</span>
  	    </td>
  	  </tr>
  	</table>
  	<div class="btn-md btn-default btn-table" @click="sysVoSubmit">提 交</div>
  	<p class="err-msg" style="display: block;left: 78px;" v-text="errMsg"></p>
  	<div v-if="loginPopup">
	  <login-popup @loginSuccess='loginSuccess'></login-popup>
	  </div>
  </div>
</div>
</template>

<script>
import config from '@/components/config'
import loginPopup from '@/components/login-popup'
export default {
  data () {
    return {
      errMsg: '',
      loginPopup: false
    }
  },
  props: ['params', 'groupCodeList'],
  mounted () {
    this.$nextTick(() => {
      console.log('|||||||' + this.params.sid)
    })
  },
  components: {
    loginPopup
  },
  methods: {
    sysVoSubmit () {
      if (!this.params.code || !this.params.name) {
        this.errMsg = '请将字典信息填写完整'
        this.hideMsg()
        return null
      }
      let url = this.params.sid ? '/sys/sys-config-group/update' : '/sys/sys-config-group/create'
      this.axios({
        method: 'post',
        url: url,
        data: this.params
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('跟新成功')
          this.cancelEdit()
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          this.errMsg = '系统分类配置跟新失败'
          this.hideMsg()
        }
      }).catch((error) => {
        console.log('error信息是：' + error)
//      this.cancelEdit()
      })
    },
    hideMsg () {
      setTimeout(() => {
        this.errMsg = ''
      }, 5000)
    },
    cancelEdit () {
      this.$emit('cancelEdit')
    },
    loginSuccess (result) { // 接收登入弹框传回的登入信息并转发给父组件
      this.$emit('loginSuccess', result)
      this.loginPopup = false
      console.log('弹窗登入成功')
    }
  }
}
</script>

<style scoped>
.popup{
  width: 560px;
  height: 600px;
  top: 100px;
  left: 679.5px;
}
.btn-table{
  position: relative;
  left: 44px;
  margin-top: 15px;
}
</style>