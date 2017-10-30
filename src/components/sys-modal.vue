<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div v-drag class="popup">
    <div class="head" style="text-align: center;width: 560px;">
	    <h3></h3>
		  <i class="icon-remove icon-white" @click="cancelEdit()"></i>			  	
	  </div>
  	<legend>
  	  <title style="width: 100%;">字典信息</title>
  	</legend>
  	<table>
  	  <tr>
  	    <td class="tdRight" for="code">字典编码:</td>
  	    <td>
  	    	<span v-if="params.sid" v-text="params.code"></span>
  	    	<input type="text" v-if="!params.sid" v-model="params.code" />
  	    </td>
   	  </tr>
  	  <tr>
  	    <td class="tdRight" for="name">字典名称:	</td>
  	    <td>
  	      <input type="text" name="name" v-model="params.name" />
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">所属分类:</td>
  	    <select v-if="!params.sid" v-model="params.groupSid">
		      <option v-for="group in groupCodeList" :value="group.sid">{{ group.name }}</option>
        </select>
        <span v-if="params.sid" v-text="params.groupName"></span>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="value1">值1:</td>
  	    <td>
  	      <input type="text" name="value1" v-model="params.value1" />
  	    </td>
      </tr>
      <tr>
  	    <td class="tdRight" for="value2">值2:</td>
  	    <td>
  	      <input type="text" name="value2" v-model="params.value2" />
  	    </td>
      </tr>
  	  <tr>
  	    <td class="tdRight" for="value3">值3:</td>
  	    <td>
  	      <input type="text" name="value3" v-model="params.value3" />
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="value4">值4:</td>
  	    <td>
  	      <input type="text" name="value4" v-model="params.value4" />
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="desc" style="vertical-align: top;">描述:</td>
  	    <td>
  	    	<textarea name="desc" rows="3" cols="30" v-model="params.desc"></textarea>
  	    </td>
  	  </tr>
  	</table>
  	<div class="btn-lg btn-default btn-table" @click="sysVoSubmit">提交</div>
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
      if (!this.params.name || !this.params.groupSid || !this.params.code || !this.params.value1 || !this.params.value2 ||
      !this.params.value3 || !this.params.value4 || !this.params.desc) {
        this.errMsg = '请将字典信息填写完整'
        this.hideMsg()
        return null
      }
      let url = this.params.sid ? '/sys/sys-config/update' : '/sys/sys-config/create'
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
          this.errMsg = '系统配置跟新失败'
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
  left: 115px;
}
</style>