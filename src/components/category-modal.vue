<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div class="popup" style="width: 600px;margin: -225px 0 0 -300px;font-size: 16px;height: 450px;overflow-x: hidden;overflow-y: auto;">
    <div class="head" style="text-align: center;">
	    <h3></h3>
		  <i class="icon-remove icon-white" @click="cancel()"></i>			  	
	  </div>
  	<legend>
  	  <title style="width: 100%;">商品分类信息</title>
  	</legend>
  	<table>
  	  <tr>
  	    <td class="tdRight">排列序号:</td>
  	    <td>
  	    	<input type="text" v-model="params.sortNum" />
  	    	<span class="high-light">*</span>
  	    </td>
   	  </tr>
  	  <tr>
  	    <td class="tdRight" for="name">名称:	</td>
  	    <td>
  	      <input type="text" name="name" v-model="params.name" />
  	      <span class="high-light">*</span>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" style="vertical-align: top;">图片:</td>
  	    <td>
  	    	<div class="category-img" v-if="hasImg">
					  <img height="90" :src="params.image.url" @click="originalImg(params.image.url)"
					  	onerror="javascript:this.src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496385415687&di=cfb8c3b6a69be436172b2fbcf2d35748&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F55%2F73%2F39I58PICCqK_1024.png'" />
					  <i class="icon-remove icon-black hide" @click="remove"></i>  	    		
  	    	  <span class="high-light" style="position: absolute;top: 5px;left: 90px;">*</span>
  	    	</div>
					<div v-if="!hasImg">
					  <div class="addTrainNo" style="left: 30px;"></div>
						<file-upload class="drop-container" :headers="{'accessToken': axios.defaults.headers.post['accessToken'], 'AppType': 'web', 'Appid': 'ironman'}"  
					  ref="upload" :post-action="imgUploadUrl" style="vertical-align: bottom;" :multiple="true" :extensions="['jpg', 'gif', 'png', 'webp', 'jpeg']" 
					  drop=".drop-container" :data="{'type': categoryType}" :size="1024 * 1024" @input-file="inputFilter">选择图片<br />可拖拽上传</file-upload>
				    <!--<span class="btn-md btn-success" style="vertical-align: bottom;" v-if="!$refs.upload || !$refs.upload.active" @click="$refs.upload.active = true">开始上传</span>-->
				    <span class="err-msg" v-show="$refs.upload && $refs.upload.uploaded" v-text="uploadMsg"></span>
					</div>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="memo" style="vertical-align: top;">备注:</td>
  	    <td>
  	    	<textarea name="memo" rows="5" cols="50" v-model="params.memo"></textarea>
  	    	<span class="high-light" style="vertical-align: top;">*</span>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" style="vertical-align: top;">状态:</td>
  	    <td>
  	      <input type="radio" name="enabled" value="true" v-model="params.enabled" />
  	      <label for="enabled">上架</label>
  	      <input type="radio" name="enabled" value="false" v-model="params.enabled" />
  	      <label for="enabled">下架</label>
  	    </td>
  	  </tr>
  	</table>
    <div v-if="showOriginal" class="popup" style="left: 30%;top: 0;" v-drag>
      <div class="img-head" style="text-align: center;">
        <h3></h3>
        <i class="icon-remove icon-white" @click="closeOriginalImg" style="top: -18px;"></i>			  	
      </div>
      <img :src="originalUrl" alt="图片加载失败！！"/>
    </div>
  	<div style="text-align: center;margin: 20px;">
  	  <div class="btn-md btn-primary btn-table btn-left" @click="categoryVoSubmit">提 交</div>
  	  <div class="btn-md btn-primary btn-table" @click="cancel">取 消</div>
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
export default {
  name: 'category-modal',
  data () {
    return {
      errMsg: '',
      categoryType: config.categoryType,
      thumbnail: [],
      uploadMsg: '',
      imgUploadUrl: 'http://im-mapi.deayea.com/sys/image/create',
      loginPopup: false,
      hasImg: true,
      showOriginal: false,
      originalUrl: ''
    }
  },
  props: ['params'],
  mounted () {
    this.$nextTick(() => {
      console.log('进入新建，编辑商品分类页面' + this.params)
      this.hasImg = true
      if (this.params.image) {
        if (!this.params.image.url) {
          this.hasImg = false
          console.log('没有图片')
        }
      } else {
        this.hasImg = false
        console.log('没有图片')
      }
    })
  },
  components: {
    loginPopup,
    filesUpload
  },
  methods: {
    categoryVoSubmit () { // 提交
      if (!this.params.name || !this.params.sortNum || !this.params.image.sid || !this.params.image.url || !this.params.memo) { // 检查表格完整性
        this.errMsg = '请将表格填写完整'
        this.hideMsg()
        return null
      }
      let url = this.params.sid ? '/sys/product-category/update' : '/sys/product-category/add'
      this.axios({
        method: 'post',
        url: url,
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
          this.errMsg = '商品分类跟新失败'
          this.hideMsg()
        }
      }).catch((error) => {
        console.log('error信息是：' + error)
      })
    },
    remove () {
      this.params.image = {}
      this.hasImg = false
//    console.log('图片删除' + this.params)
    },
    inputFilter (newFile, oldFile) { // 附件更新
      this.upload()
      if (newFile.error !== oldFile.error) { // 上传错误
        console.log('error', newFile.error, newFile)
        this.uploadMsg = newFile.name + '上传失败：' + newFile.error
        this.hideMsg()
      }
      if (newFile.success !== oldFile.success) { // 上传成功
        console.log('success', newFile.success, newFile)
        if (newFile.response.type === 1) {
          this.uploadMsg = newFile.response.result.sid
          this.hideMsg()
          this.params.image = newFile.response.result
          this.hasImg = true
        } else if (newFile.response.type === 0) {
          this.uploadMsg = newFile.response.msg
          this.hideMsg()
        } else if (newFile.response.type === 401) {
          console.log('token验证失败')
          config.gotoLogin()
          this.loginPopup = true
        }
      }
    },
    originalImg (imgUrl) { // 显示原图
      this.showOriginal = true
      this.originalUrl = imgUrl
    },
    closeOriginalImg () {
      this.showOriginal = false
      this.originalUrl = ''
    },
    upload () { // 上传附件
      if (!this.$refs.upload || !this.$refs.upload.active) {
        this.$refs.upload.active = true
      }
    },
    hideMsg () {
      setTimeout(() => {
        this.errMsg = ''
        this.uploadMsg = ''
      }, 5000)
    },
    cancel () { // 关闭弹框
      this.$emit('cancel') // 告诉父组件商品分类编辑，新建完成
    },
    loginSuccess (result) {
      this.loginPopup = false
      this.$emit('loginSuccess', result)
      console.log('弹窗登入成功')
    }
  }
}
</script>

<style scoped>
textarea{
	border-radius: 3px;
	margin-top: 6px;
}
.category-img{
	width: 90px;
  position: relative;
}
.category-img:hover > i{
  display: inline-block !important;
}
</style>