<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div class="popup" style="left: 30%;top: 80px;width: 700px;font-size: 16px;height: 400px;overflow-x: hidden;overflow-y: auto;">
    <div class="head" style="text-align: center;width: 700px;">
		  <i class="icon-remove icon-white" @click="cancel()"></i>			  	
	  </div>
	  <legend>
  	  <title style="width: 100%;">录入订单信息</title>
  	</legend>
  	<table>
  	  <tr>
  	    <td class="tdRight" for="group">第三方平台:</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.outerPlatform"/>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">第三方账号:</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.outerAccount"/>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">订单号:</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.outerOrderId"/>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">订单原价:</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.outerOrderPrice"/>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">商品名称:</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.outerProductName"/>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">外部平台的商品编号:</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.outerProductNo"/>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">外部平台的商品链接:</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.outerProductUrl"/>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">实际需要支付的金额:</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.outerOrderPaidPrice"/>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">外部平台商品单价(原价):</td>
  	    <td class="tdLeft">
	  	    <input type="text" v-model="params.outerProductPrice"/>
  	    </td>
  	  </tr>
  	</table>
  	<div style="text-align: center;">
  	  <div class="btn-md btn-default btn-table btn-left" @click="orderSubmit">提 交</div>
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
  name: 'order-creat',
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
    orderSubmit () { // 提交
      if (!this.params.outerPlatform || !this.params.outerAccount || !this.params.outerOrderPrice || !this.params.outerOrderPaidPrice ||
       !this.params.outerProductNo || !this.params.outerProductName || !this.params.outerProductUrl || !this.params.outerProductPrice) { // 检查表格完整性
        this.errMsg = '请将订单信息填写完整'
        this.hideMsg()
        return null
      }
      this.axios({
        method: 'post',
        url: '/sys/order/outer',
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
          this.errMsg = '备注信息跟新失败'
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
.tdRight{
  width: 180px;
}
</style>