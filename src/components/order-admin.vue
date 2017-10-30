<template>
<div style="margin-top: 40px;">
	<div class="tdRight">
	  <label for="type">类型：</label>
  	<select v-model="type">
	   <option v-for="type in typeList" :value="type.value">{{ type.name }}</option>
    </select>
	</div>
	<div class="tdLeft">
		<files-upload :type='type' url='http://192.168.0.242:8280/sys/image/create' @cancelUpload='cancelUpload'></files-upload>
	</div>
	<!--附件上传end-->
  <div v-if="loginPopup">
  	<login-popup @loginSuccess='loginSuccess'></login-popup>
  </div>
</div>
</template>

<script>
//  import config from '@/components/config'
import loginPopup from '@/components/login-popup'
import filesUpload from '@/components/files-upload'
export default {
  name: 'orderAdmin',
  data () {
    return {
      loginPopup: false,
      type: 1,
      fileUploadDiv: false,
      typeList: [{
        'value': 1,
        'name': '资讯'
      }, {
        'value': 2,
        'name': '商品分类图'
      }, {
        'value': 3,
        'name': '商品图'
      }, {
        'value': 4,
        'name': '订单图片'
      }]
    }
  },
  components: {
    loginPopup,
    filesUpload
  },
  mounted () {
    this.$nextTick(() => {
      console.log('1')
      this.loginPopup = false
      this.query()
    })
  },
  methods: {
//  query () { // 查找订单历史记录
//    this.axios({
//      method: 'POST',
//      url: '/sys/sys-config/create',
//      data: this.orderVo
//    }).then((response) => {
//      var data = response.data
//      if (data.type === 1) {
//        console.log('成功')
//      } else if (data.type === 401) { // 登入信息验证失败
//        console.log('token验证失败')
//        config.gotoLogin()
//        this.loginPopup = true
//      } else {
//        console.log('失败')
//      }
//    }).catch((error) => {
//      console.log(error)
//    })
//  },
    loginSuccess (result) { // 登入成功（从弹窗登入成功）
      this.loginPopup = false
      this.$emit('setLoginInfo', result) // 登入成功，显示导航栏
      console.log('弹窗登入成功')
    },
    // 附件上传start
    fileUpload () {
      this.fileUploadDiv = true
    },
    cancelUpload () {
      this.fileUploadDiv = false
    }
    // 附件上传end
  }
}
</script>

<style scoped>
.tdLeft{
  display: inline-block;
}
.tdRight{
  display: inline-block;
  width: 300px;
  vertical-align: top;
  padding-right: 20px;
}
.tdRight select{
	height: 25px;
}
</style>