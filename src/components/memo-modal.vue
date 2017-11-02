<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div class="popup" style="left: 30%;top: 80px;width: 700px;font-size: 16px;height: 400px;overflow-x: hidden;overflow-y: auto;">
    <div class="head" style="text-align: center;width: 700px;">
		  <i class="icon-remove icon-white" @click="cancel()"></i>			  	
	  </div>
	  <legend>
  	  <title style="width: 100%;">{{type === 1 ? '修改备注' : '修改状态'}}</title>
  	</legend>
  	<table>
  	  <tr v-if="type === 2">
  	    <td class="tdRight" for="group">状态:</td>
  	    <select v-model="params.postStatus">
		      <option v-for="status in statusList" :value="status.code">{{ status.name }}</option>
        </select>
        <span class="high-light">*</span>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="memo" style="vertical-align: top;">备注:</td>
  	    <td>
  	      <textarea name="memo" v-model="params.memo" rows="5" cols="50"></textarea>
  	      <span class="high-light">*</span>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" style="vertical-align: top;">图片:</td>
  	    <td>
  	      <files-upload :type='orderType' :imgUrls='params.detailImages' :url='imgUpUrl' @transmitImgInfo='getImg'></files-upload>
  	    </td>
  	  </tr>
  	</table>
  	<div style="text-align: center;">
  	  <div class="btn-md btn-default btn-table btn-left" @click="memoVoSubmit">提 交</div>
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
import filesUpload from '@/components/files-upload'
export default { // 产品新增，编辑弹框
  name: 'memo-modal',
  data () {
    return {
      errMsg: '',
      statusList: [],
      orderType: config.orderType,
      imgUpUrl: 'http://im-mapi.deayea.com/sys/image/create',
      loginPopup: false,
      params: {
        'sids': []
      }
    }
  },
  props: ['type', 'sid'],
  mounted () {
    this.$nextTick(() => {
      console.log('新增备注,sid:' + this.sid)
      this.getCanChangeStatus()
    })
  },
  components: {
    loginPopup,
    filesUpload
  },
  methods: {
    getCanChangeStatus () {
      this.axios({
        method: 'GET',
        params: {'orderSid': this.sid},
        url: '/sys/order/status/can-change-list'
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('获取可变更的状态成功')
          this.statusList = data.result.list
          if (this.statusList.length === 0 && this.type === 2) {
            this.errMsg = '没有可更改的状态'
          }
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          this.errMsg = '获取可变更的状态失败'
          this.hideMsg()
        }
      }).catch((error) => {
        console.log('error信息是：' + error)
      })
    },
    memoVoSubmit () { // 提交
      this.params.orderSid = this.sid
      this.params.postStatus = this.params.postStatus ? this.params.postStatus : null
      if (!this.params.memo) { // 检查表格完整性
        this.errMsg = '请将备注信息填写完整'
        this.hideMsg()
        return null
      }
      if (this.type === 2) {
        if (!this.params.postStatus) {
          this.errMsg = '请将备注信息填写完整'
          this.hideMsg()
          return null
        }
      }
      this.axios({
        method: 'post',
        url: '/sys/order/memo/create',
        data: this.params
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('跟新成功')
          this.cancel()
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else if (data.type === 4001) {
          this.errMsg = '不允许的状态迁移'
          this.hideMsg()
        } else {
          this.errMsg = '备注信息跟新失败'
          this.hideMsg()
        }
      }).catch((error) => {
        console.log('error信息是：' + error)
      })
    },
    getImg (imgs) {
      this.params.sids = []
      for (var i = 0; i < imgs.length; i++) {
        this.params.sids.push(imgs[i].sid)
      }
    },
    hideMsg () {
      setTimeout(() => {
        this.errMsg = ''
        this.uploadMsg = ''
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