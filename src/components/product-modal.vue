<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div class="popup" style="left: 30%;top: 80px;width: 700px;font-size: 16px;height: 500px;overflow-x: hidden;overflow-y: auto;">
    <div class="head" style="text-align: center;width: 700px;">
	    <p style="font-weight: bold;">商品信息</p>
		  <i class="icon-remove icon-white" @click="cancel()"></i>			  	
	  </div>
  	<table>
  	  <tr>
  	    <td class="tdRight" for="code">货号:</td>
  	    <td>
  	    	<input v-focus type="text" v-model="params.no" />
  	    </td>
   	  </tr>
  	  <tr>
  	    <td class="tdRight" for="name">名称:	</td>
  	    <td>
  	      <input type="text" name="name" v-model="params.name" />
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">分类:</td>
  	    <select v-model="params.categorySid">
		      <option v-for="category in categoryList" :value="category.sid">{{ category.name }}</option>
        </select>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="points">所需价格:</td>
  	    <td>
  	      <input type="text" name="points" v-model="params.points" />
  	    </td>
  	  </tr>
  	  <!--<tr>
  	    <td class="tdRight" for="experience">经验值门槛:</td>
  	    <td>
  	      <input type="text" name="experience" v-model="params.experience" />
  	    </td>
      </tr>-->
      <tr>
  	    <td class="tdRight" for="sortNum">排列序号:</td>
  	    <td>
  	      <input type="text" name="sortNum" v-model="params.sortNum" />
  	    </td>
      </tr>
      <!--<tr>
  	    <td class="tdRight" for="sortNum">预览状态:</td>
  	    <td>
  	      <input type="radio" name="preview" value="true" v-model="params.preview" /> 预览
  	      <input type="radio" name="preview" value="false" v-model="params.preview" /> 非预览
  	    </td>
      </tr>-->
      <tr class="time-pick">
  	    <td class="tdRight" for="startedAt">上下架时间:</td>
  	    <td>
  	      <datepicker v-model="startedAt.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
  	      <input type="time" class="time-input" v-model="startedAt.time" />
  	      <p>到</p>
  	      <datepicker v-model="endedAt.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
  	      <input type="time" class="time-input" v-model="endedAt.time" />
  	    </td>
      </tr>
  	  <tr>
  	    <td class="tdRight" for="detail" style="vertical-align: top;">文字说明:</td>
  	    <td>
  	      <textarea type="text" name="detail" v-model="params.detail" rows="3"></textarea>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="memo" style="vertical-align: top;">备注:</td>
  	    <td>
  	      <textarea type="text" name="memo" v-model="params.memo" rows="3"></textarea>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" style="vertical-align: top;">缩略图:</td>
  	    <td v-if="thumbnailModel">
  	    	<div class="thumbnail-img" v-if="hasImg">
					  <img height="90" :src="params.thumbnail.url" @click="originalImg(params.thumbnail.url)"
					  	onerror="javascript:this.src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496385415687&di=cfb8c3b6a69be436172b2fbcf2d35748&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F55%2F73%2F39I58PICCqK_1024.png'"/>
					  <i class="icon-remove icon-black hide" @click="remove"></i>  	    		
  	    	</div>
					<div v-if="!hasImg">
					  <div class="addTrainNo" style="left: 30px;"></div>
					  <file-upload class="drop-container" :headers="{'accessToken': axios.defaults.headers.post['accessToken'], 'AppType': 'web', 'Appid': 'ironman'}"  
					  ref="upload" :post-action="imgUpUrl" style="vertical-align: bottom;" :multiple="true" :extensions="['jpg', 'gif', 'png', 'webp', 'jpeg']" 
					  drop=".drop-container" :data="{'type': productType}" @input-file="inputFilter" :size="1024 * 1024">选择图片<br />可拖拽上传</file-upload>
				    <!--<span class="btn-md btn-success" style="vertical-align: bottom;" v-if="!$refs.upload || !$refs.upload.active" @click="$refs.upload.active = true">开始上传</span>-->
				    <span class="err-msg" v-show="$refs.upload && $refs.upload.uploaded" v-text="uploadMsg"></span>
					</div>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" style="vertical-align: top;">详情图:</td>
  	    <td>
  	      <files-upload :type='productType' :imgUrls='params.detailImages' :url='imgUpUrl' @transmitImgInfo='getDetailImg'></files-upload>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" style="vertical-align: top;">头图:</td>
  	    <td>
  	      <files-upload :type='productType' :imgUrls='params.headerImages' :url='imgUpUrl' @transmitImgInfo='getHeaderImg'></files-upload>
  	    </td>
  	  </tr>
  	  <!--<tr>
  	    <td class="tdRight" style="vertical-align: top;">状态:</td>
  	    <td>
  	      <input type="radio" name="enabled" value="true" v-model="params.enabled" />
  	      <label for="enabled">上架</label>
  	      <input type="radio" name="enabled" value="false" v-model="params.enabled" />
  	      <label for="enabled">下架</label>
  	    </td>
  	  </tr>-->
  	</table>
    <div v-if="showOriginal" class="popup" v-drag style="left: 650px;top: 150px;z-index: 111111111111111111111111;">
	    <div class="img-head" style="text-align: center;">
	      <h3></h3>
		    <i class="icon-remove icon-white" @click="closeOriginalImg" style="top: -10px;"></i>			  	
	    </div>
	  	<img :src="originalUrl" alt="图片加载失败！！"/>
		</div>
  	<footer style="text-align: center;top: 580px;height: 40px;width: 690px;">
  	  <div class="btn-md btn-default btn-table btn-left" @click="productVoSubmit">提 交</div>
  	  <div class="btn-md btn-default btn-table" @click="cancel">取 消</div>
  	  <div class="err-msg" style="display: block;font-size: 12px;">提交之后商品强制变为预览状态</div>
  	  <p class="err-msg" style="position: absolute;" v-text="errMsg"></p>
  	</footer>
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
import Datepicker from 'vuejs-datepicker'
export default { // 产品新增，编辑弹框
  name: 'product-modal',
  data () {
    return {
      errMsg: '',
      productType: config.productType,
      thumbnail: [],
      thumbnailModel: false,
      imgUpUrl: 'http://192.168.0.242:8280/sys/image/create',
      uploadMsg: '',
      loginPopup: false,
      hasImg: true,
      showOriginal: false,
      originalUrl: '',
      startedAt: {
        'date': '',
        'time': '00:00'
      },
      endedAt: {
        'date': '',
        'time': '00:00'
      },
      state: {
        format: 'yyyy-MM-dd',
        highlighted: {
          dates: [
            new Date()
          ]
        }
      }
    }
  },
  props: ['params', 'categoryList'],
  mounted () {
    this.$nextTick(() => {
      console.log('|||||||' + this.params.sid)
      this.thumbnail.push(this.params.thumbnail)
      this.thumbnailModel = true
      this.hasImg = true
      if (this.params.thumbnail) {
        if (!this.params.thumbnail.url) {
          this.hasImg = false
          console.log('没有图片1')
        }
      } else {
        this.hasImg = false
        console.log('没有图片2')
      }
      this.endedAt.date = this.params.endedAt.split(' ')[0]
      this.startedAt.date = this.params.startedAt.split(' ')[0]
    })
  },
  components: {
    loginPopup,
    filesUpload,
    Datepicker
  },
  methods: {
    productVoSubmit () { // 提交
      if (!this.params.categorySid || !this.params.no || !this.params.name || (!this.params.points && this.params.points !== '0') || !this.params.sortNum ||
       !this.params.detail || !this.params.thumbnail.url || !this.params.thumbnail.sid ||
       !this.params.headerImages || this.params.headerImages.length === 0 || !this.params.detailImages || this.params.detailImages.length === 0) { // 检查表格完整性
        this.errMsg = '请将表格填写完整'
        this.hideMsg()
        return null
      }
      let url = this.params.sid ? '/sys/product/update' : '/sys/product/add'
      if (this.endedAt.date) {
        this.params.endedAt = config.dateToString(new Date(this.endedAt.date), 'yyyy-MM-dd') + ' ' + this.endedAt.time + ':00'
      }
      if (this.startedAt.date) {
        this.params.startedAt = config.dateToString(new Date(this.startedAt.date), 'yyyy-MM-dd') + ' ' + this.startedAt.time + ':00'
      }
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
          this.errMsg = '系统配置跟新失败'
          this.hideMsg()
        }
      }).catch((error) => {
        console.log('error信息是：' + error)
      })
    },
    remove () {
      this.params.thumbnail = {}
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
          this.params.thumbnail = newFile.response.result
          this.hasImg = true
        } else if (newFile.response.type === 0) {
          this.uploadMsg = newFile.response.msg // 显示报错信息
          this.hideMsg()
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
    getDetailImg (detailImgs) {
      this.params.detailImages = []
      for (var i = 0; i < detailImgs.length; i++) {
        this.params.detailImages.push(detailImgs[i])
      }
    },
    getHeaderImg (headerImgs) {
      this.params.headerImages = []
      for (var i = 0; i < headerImgs.length; i++) {
        this.params.headerImages.push(headerImgs[i])
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
/*.datetime-picker div input{
  min-width: 140px;
  padding: 0 0 0 10px;
}*/
.vdp-datepicker{
  display: inline-block;
}
.vdp-datepicker div{
  display: inline-block;
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