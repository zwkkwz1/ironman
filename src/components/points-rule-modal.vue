<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div class="popup" style="left: 30%;top: 40px;width: 700px;font-size: 16px;height: 500px;overflow-x: hidden;overflow-y: auto;">
    <div class="head" style="text-align: center;width: 700px;">
	  <p style="font-weight: bold;">规则信息</p>
	  <i class="icon-remove icon-white" @click="cancel()"></i>			  	
    </div>
  	<table>
  	  <tr>
  	    <td class="tdRight" for="code">名 称:</td>
  	    <td>
  	      <input type="text" v-model="params.name" />
  	      <span class="high-light">*</span>
  	    </td>
   	  </tr>
  	  <tr>
  	    <td class="tdRight" for="name">关键字:</td>
  	    <td>
  	      <input type="text" name="name" v-model="params.key" style="min-width: 400px;"/>
  	      <span class="high-light">*</span>
  	    </td>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">所属部门:</td>
  	    <select v-model="params.orgSid">
  	    	<option :value="0"></option>
          <option v-for="ld in ldList" :value="ld.sid">{{ ld.name }}</option>
        </select>
        <span class="high-light">*</span>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="group">类 型:</td>
  	    <select v-model="params.type">
          <option v-for="type in typeList" :value="type.value">{{ type.name }}</option>
        </select>
        <span class="high-light">*</span>
  	  </tr>
  	  <tr>
  	    <td class="tdRight" for="sortNum">排列序号:</td>
  	    <td>
  	      <input type="text" name="sortNum" v-model="params.sortNum" />
  	      <span class="high-light">*</span>
  	    </td>
      </tr>
  	  <tr>
  	    <td class="tdRight" for="createdBy">参数1:</td>
  	    <td>
  	      <input type="text" name="createdBy" v-model="params.param1" />
  	    </td>
      </tr>
      <tr>
  	    <td class="tdRight" for="createdBy">参数2:</td>
  	    <td>
  	      <input type="text" name="createdBy" v-model="params.param2" />
  	    </td>
      </tr>
      <tr>
  	    <td class="tdRight" for="updatedBy">参数3:</td>
  	    <td>
  	      <input type="text" name="updatedBy" v-model="params.param3" />
  	    </td>
      </tr>
      <tr>
  	    <td class="tdRight" for="updatedDt">参数4:</td>
  	    <td>
  	      <input type="text" name="updatedDt" v-model="params.param4" />
  	    </td>
      </tr>
      <tr>
  	    <td class="tdRight" for="updatedDt">参数5:</td>
  	    <td>
  	      <input type="text" name="updatedDt" v-model="params.param5" />
  	    </td>
      </tr>
      <tr class="time-pick">
  	    <td class="tdRight" for="startedAt">生效时间:</td>
  	    <td>
  	      <datepicker v-model="startedAt.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
  	      <input type="time" class="time-input" v-model="startedAt.time" />
  	      <p>到</p>
  	      <datepicker v-model="endedAt.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
  	      <input type="time" class="time-input" v-model="endedAt.time" />
  	    </td>
      </tr>
      <tr>
  	    <td class="tdRight" for="memo" style="vertical-align: top;">备 注:</td>
  	    <td>
  	    	<textarea name="memo" rows="5" cols="50" v-model="params.memo"></textarea>
  	    	<span class="high-light">*</span>
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
  	<div style="text-align: center;top: 580px;height: 40px;width: 690px;">
  	  <div class="btn-md btn-default btn-table btn-left" @click="consultVoSubmit">提 交</div>
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
import Datepicker from 'vuejs-datepicker'
export default { // 产品新增，编辑弹框
  name: 'consult-modal',
  data () {
    return {
      errMsg: '',
      uploadMsg: '',
      loginPopup: false,
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
  props: ['params', 'typeList', 'ldList'],
  mounted () {
    this.$nextTick(() => {
      console.log('|||||||' + this.params.sid)
      this.thumbnailModel = true
      this.hasImg = true
      if (this.params.imageUrl) {
        this.hasImg = true
        console.log('没有图片1111111')
      } else {
        this.hasImg = false
        console.log('没有图片2222222222')
      }
      if (this.params.endedAt) {
        this.endedAt.date = this.params.endedAt.split(' ')[0]
      }
      if (this.params.startedAt) {
        this.startedAt.date = this.params.startedAt.split(' ')[0]
      }
    })
  },
  components: {
    loginPopup,
    filesUpload,
    Datepicker
  },
  methods: {
    consultVoSubmit () { // 提交
      delete this.params.updatedDt
      delete this.params.updatedBy
      delete this.params.createdDt
      delete this.params.createdBy
      if (this.endedAt.date) {
        this.params.endedAt = config.dateToString(new Date(this.endedAt.date), 'yyyy-MM-dd') + ' ' + (this.endedAt.time ? this.endedAt.time + ':00' : '00:00:00')
      }
      if (this.startedAt.date) {
        this.params.startedAt = config.dateToString(new Date(this.startedAt.date), 'yyyy-MM-dd') + ' ' + (this.startedAt.time ? this.startedAt.time + ':00' : '00:00:00')
      }
      if (!this.params.type || !this.params.key || !this.params.name ||
       !this.params.memo || !this.params.startedAt || !this.params.endedAt) { // 检查表格完整性
        this.errMsg = '请将表格填写完整'
        this.hideMsg()
        return null
      }
      if (!this.params.param1 && !this.params.param2 && !this.params.param3 && !this.params.param4 && !this.params.param5) {
        this.errMsg = '5个参数值必须有一个不为空'
        this.hideMsg()
        return null
      }
      let url = this.params.sid ? '/sys/points-rule-conf/update' : '/sys/points-rule-conf/add'
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
          this.errMsg = '积分规则跟新失败'
          this.hideMsg()
        }
      }).catch((error) => {
        console.log('error信息是：' + error)
      })
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