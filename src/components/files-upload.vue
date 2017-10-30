<template>
  <div class="file-upload-div">
  	<!--<div class="head" style="text-align: center;">
	    <h3></h3>
		  <i class="icon-remove icon-white" @click="cancelUpload"></i>			  	
	  </div>
  	<div class="table file-upload-table">
			<table style="min-width: 600px;width: 100%;" class="table-hover">
				<colgroup>
					<col style="width:40px;"/>
					<col />
					<col />
					<col />
					<col />
					<col />
					<col />
					<col />
				</colgroup>
				<thead>
				  <th style="min-width:40px;max-width: 50px;">序号</th>
				  <th>名称</th>
				  <th>active</th>
				  <th>progress</th>
				  <th>size</th>
				  <th>speed</th>
				  <th>success</th>
				  <th></th>
				</thead>
				<tbody>
					<tr v-for="(file,index) in files">
						<td>
							<div v-text="index + 1"></div>
						</td>
						<td>
							<div style="min-width:80px;max-width: 160px;overflow: hidden;" :title="file.name" v-text="file.name"></div>
						</td>
						<td>
							<div style="min-width:80px" v-text="file.active"></div>
						</td>
						<td>
							<div style="min-width:80px" v-text="file.progress"></div>
						</td>
						<td>
							<div style="min-width:80px">{{file.size + 'B'}}</div>
						</td>
						<td>
							<div style="min-width:80px" v-text="file.speed"></div>
						</td>
						<td>
							<div style="min-width:80px" v-text="file.success"></div>
						</td>
						<td style="min-width: 150px;">
							<div class="btn-sm btn-primary" @click="sysEdit(sysConfig)">编辑</div>
							<div class="btn-sm btn-success" @click.prevent="remove(file)">删除</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>-->
  	<ul>
  	  <draggable v-model="uploadedFiles" @end="dragEnd">
  		  <li v-for="(uploadedFile, index) in uploadedFiles" class="show-img">
  			  <img height="90" :src="uploadedFile.url" onerror="javascript:this.src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496385415687&di=cfb8c3b6a69be436172b2fbcf2d35748&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F55%2F73%2F39I58PICCqK_1024.png'" 
  			  	alt="上海帝仪" @click="originalImg(uploadedFile.url)" />
  			  <i class="icon-remove icon-black hide" @click="remove(index)"></i>
  		  </li>
  		  <div style="display: inline-block;position: relative;top: -7px;left: 8px;">
  		  	<div class="addTrainNo"></div>
  			  <file-upload class="drop-container" :headers="{'accessToken': axios.defaults.headers.post['accessToken'], 'AppType': 'web', 'Appid': 'ironman'}"  
  		      ref="upload" :post-action="url" style="vertical-align: bottom;" :multiple="true" :extensions="['jpg', 'gif', 'png', 'webp', 'jpeg']" drop=".drop-container" 
  		      :data="{'type': type}" :value="files" @input-file="inputFilter" v-model="files" :size="1024 * 1024">选择图片<br />可拖拽上传</file-upload>
  		    <!--<span class="btn-md btn-success" style="vertical-align: bottom;" v-if="!$refs.upload || !$refs.upload.active" @click="$refs.upload.active = true">开始上传</span>-->
  		  </div>
  		  <li class="err-msg" v-show="$refs.upload && $refs.upload.uploaded" style="font-size: 14px;" v-text="uploadMsg"></li>
  	  </draggable>
  	</ul>
  	<div v-if="showOriginal" class="popup" v-drag style="left: 570px;top: 150px;">
  	  <div class="img-head" style="text-align: center;width: 100%;">
        <h3></h3>
  	    <i class="icon-remove icon-white" @click="closeOriginalImg" style="top: -18px;"></i>			  	
      </div>
    	<img alt="图片加载失败！！" :src="originalUrl" />
  	</div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  	<!--<file-upload v-model="files"></file-upload>-->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import config from '@/components/config'
import loginPopup from '@/components/login-popup'
export default {
  name: 'filesUpload',
  data () {
    return {
      files: [],
      uploadedFiles: [],
      loginPopup: false,
      showOriginal: false,
      uploadMsg: '',
      originalUrl: ''
    }
  },
  components: {
    draggable,
    loginPopup
  },
  props: ['type', 'url', 'imgUrls'],
  mounted () {
    this.$nextTick(() => {
      console.log('进入上传图片组件')
      this.uploadedFiles = []
      if (!(typeof this.uploadedFiles === 'object' && !isNaN(this.uploadedFiles.length))) { // this.uploadedFiles是对象
        this.uploadedFiles.push(this.imgUrls)
        console.log('是对象')
      } else if (typeof this.uploadedFiles === 'object' && !isNaN(this.uploadedFiles.length)) { // this.uploadedFiles是数组
        this.uploadedFiles = this.imgUrls
        console.log('是数组' + this.uploadedFiles)
      }
    })
  },
  methods: {
    inputFilter (newFile, oldFile) { // 附件更新
      this.upload()
      this.uploadedFiles = this.uploadedFiles ? this.uploadedFiles : []
      if (newFile.error !== oldFile.error) { // 上传错误
        console.log('error', newFile.error, newFile)
        this.uploadMsg = newFile.name + '上传失败：' + newFile.error
        this.hideMsg()
      }
      if (newFile.success !== oldFile.success) { // 上传成功
        console.log('success', newFile.success, newFile)
        if (newFile.response.type === 1) {
          this.uploadMsg = newFile.response.result.sid
          this.uploadedFiles.push(newFile.response.result) // 已上传的文件
          this.$emit('transmitImgInfo', this.uploadedFiles)
        } else if (newFile.response.type === 0) {
          this.uploadMsg = newFile.response.msg
        } else if (newFile.response.type === 401) {
          console.log('token验证失败')
          config.gotoLogin()
          this.loginPopup = true
        }
      }
    },
    upload () { // 上传附件
      if (!this.$refs.upload || !this.$refs.upload.active) {
        this.$refs.upload.active = true
      }
    },
    remove (index) { // 删除附件
      this.uploadedFiles.splice(index, 1)
      this.$emit('transmitImgInfo', this.uploadedFiles) // 每次上传成功或者删除，把剩余的图片传给父组件
    },
    cancelUpload () {
      this.$emit('cancelUpload')
    },
    dragEnd () {
      this.$emit('transmitImgInfo', this.uploadedFiles)
    },
    originalImg (imgUrl) { // 显示原图
      this.showOriginal = true
      this.originalUrl = imgUrl
    },
    closeOriginalImg () {
      this.showOriginal = false
      this.originalUrl = ''
    },
    loginSuccess (result) {
      this.loginPopup = false
      this.$emit('setLoginInfo', result) // 登入成功，显示导航栏
      console.log('弹窗登入成功')
    },
    hideMsg () {
      setTimeout(() => {
        this.uploadMsg = ''
      }, 5000)
    }
  }
}
</script>

<style scoped>
.file-upload-div{
  width: 450px;
  border: 1px dashed #999;
  display: inline-block;
  position: relative;
  background: #fff;
  padding: 10px;
}
.file-upload-table{
  margin: 20px;
}
.show-img{
  width: auto;
  position: relative;
}
.show-img:hover > i{
	display: inline-block !important;
}
ul{
	display: inline-block;
	margin: 0;
  font-size: 0;
}
li{
  margin: 5px;
}
/*隐藏滚动条*/
::-webkit-scrollbar{
	width: 0px;
}
img{
  margin: 0;
}
</style>