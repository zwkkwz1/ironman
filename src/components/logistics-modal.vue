<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div class="popup" style="left: 30%;top: 80px;width: 700px;font-size: 16px;height: 400px;overflow-x: hidden;overflow-y: auto;">
    <div class="head" style="text-align: center;width: 700px;">
		  <i class="icon-remove icon-white" @click="cancel()"></i>			  	
	  </div>
	  <legend>
  	  <title style="width: 100%;">录入物流信息</title>
  	</legend>
  	<table>
  	  <tr>
  	    <td class="tdRight" for="group">物流公司:</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.shipmentName"/>
	  	    <span class="high-light">*</span>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">物流单号:</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.shipmentNo"/>
	  	    <span class="high-light">*</span>
  	    </td>
  	  </tr>
  	</table>
  	<div style="text-align: center;">
  	  <div class="btn-md btn-default btn-table btn-left" @click="logisticsSubmit">提 交</div>
  	  <div class="btn-md btn-default btn-table" @click="cancel">取 消</div>
  	  <p class="err-msg" style="position: absolute;" v-text="errMsg"></p>
  	</div>
  	<div v-if="loginPopup">
	  	<login-popup @loginSuccess='loginSuccess'></login-popup>
	  </div>
  </div>
</div>
</template>

<script>
import config from '@/components/config'
import loginPopup from '@/components/login-popup'
export default { // 产品新增，编辑弹框
  name: 'logistics-modal',
  data () {
    return {
      errMsg: '',
      loginPopup: false
    }
  },
  props: ['params'],
  mounted () {
    this.$nextTick(() => {
      console.log('新增备注,sid:' + this.sid)
    })
  },
  components: {
    loginPopup
  },
  methods: {
    logisticsSubmit () { // 提交
      if (!this.params.shipmentName || !this.params.shipmentNo) { // 检查表格完整性
        this.errMsg = '请将物流信息填写完整'
        this.hideMsg()
        return null
      }
//    let logisticsVo = {
//      'sid': this.params.sid,
//      'shipmentName': this.params.shipmentName,
//      'shipmentNo': this.params.shipmentNo
//    }
      this.axios({
        method: 'post',
        url: '/sys/order/logistics',
        data: this.params
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('跟新成功')
          this.cancel()
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          this.errMsg = '物流信息跟新失败'
          this.hideMsg()
        }
      }).catch((error) => {
        console.log('error信息是：' + error)
      })
    },
    hideMsg () {
      setTimeout(() => {
        this.errMsg = ''
      }, 5000)
    },
    cancel () { // 关闭弹框
      this.$emit('cancel')
    },
    loginSuccess (result) {
      this.$emit('loginSuccess', result)
      console.log('弹窗登入成功')
      this.loginPopup = false
    }
  }
}
</script>

<style scoped>
textarea{
	width: 321px;
	border-radius: 3px;
	margin-top: 6px;
}
.thumbnail-img{
	width: 90px;
  position: relative;
}
.thumbnail-img:hover > i{
  display: inline-block !important;
}
.datetime-picker{
	display: inline-block;
}
#tj-datetime-input{
  width: 160px;
  height: 20px;
}
.time-input{
  width: 80px;
  height: 20px;
  padding: 0;
  font-family: '微软雅黑';
  position: relative;
  top: 1px;
}
</style>