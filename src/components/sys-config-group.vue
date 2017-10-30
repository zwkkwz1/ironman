<template>
<div>
  <legend class="search">
  	<div>
  		<label for="name">字典分类名称：</label>
	    <input type="text" name="name" id="name" v-model="groupVo.name" />
  	</div>
  	<div>
  		<label for="code">字典分类Code：</label>
	  	<input type="text" name="code" id="code" v-model="groupVo.code" />
  	</div>
	  <div class="btn-md btn-default" @click="getSysConfigGroupList">查 询</div>
	  <div class="btn-md btn-default" @click="creatSys">新 建</div>
  </legend>
  <div class="table">
		<table style="min-width: 600px;width: 100%;" class="table-hover">
			<colgroup>
				<col style="width:40px;"/>
				<col/>
				<col/>
				<col/>
			</colgroup>
			<thead>
			  <th style="min-width:40px;max-width: 50px;">序号</th>
			  <th>名称</th>
			  <th>code</th>
			  <th></th>
			</thead>
			<tbody>
				<tr v-for="(sysConfigGroup, index) in sysConfigGroupList" @click="clickTr(index)" :class="{tableActive: activeIndex === index}">
					<td>
						<div v-text="index + 1"></div>
					</td>
					<td>
						<div style="min-width:80px" v-text="sysConfigGroup.name"></div>
					</td>
					<td>
						<div style="min-width:80px" v-text="sysConfigGroup.code"></div>
					</td>
					<td style="width: 200px;">
						<div class="btn-sm btn-default btn-left" @click="sysEdit(sysConfigGroup)">编辑</div>
						<div class="btn-sm btn-default" @click="sysDelete(sysConfigGroup)">删除</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div v-if="sysModelShow">
		<sys-group-modal @cancelEdit="cancelEdit" :params="sysConfigVo" @loginSuccess='loginSuccess'></sys-group-modal>
	</div>
  <div v-if="loginPopup">
  	<login-popup @loginSuccess='loginSuccess'></login-popup>
  </div>
</div>
</template>

<script>
import config from '@/components/config'
import loginPopup from '@/components/login-popup'
import sysGroupModal from '@/components/sys-group-modal'
export default {
  name: 'sys-group',
  data () {
    return {
      msg: '系统设置',
      groupVo: {
        'code': '',
        'name': ''
      },
      files: [],
      activeIndex: -1, // 被选中的列表的index
      sysConfigVo: {},
      sysConfigGroupList: [],
      loginPopup: false,
      sysModelShow: false
    }
  },
  components: {
    loginPopup,
    sysGroupModal
  },
  mounted () {
    this.$nextTick(() => {
      console.log('进入系统设置')
      this.getSysConfigGroupList()
      this.activeIndex = -1
    })
  },
  methods: {
    getSysConfigGroupList () { // 获取系统设置分类列表
      this.axios({
        method: 'post',
        url: '/sys/sys-config-group/list',
        data: this.groupVo
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('成功')
          this.sysConfigGroupList = data.result.list
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    sysEdit (sysConfig) { // 编辑
      this.axios({
        method: 'get',
        params: {'sid': sysConfig.sid},
        url: '/sys/sys-config-group/get'
//      url: 'http://localhost:7080/static/sys-config-vo.json'
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          this.sysConfigVo = data.result
          this.sysModelShow = true
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('获取详情失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    sysDelete (sysConfig) { // 删除
      this.axios({
        method: 'get',
        params: {'sid': sysConfig.sid},
        url: '/sys/sys-config-group/delete'
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('删除成功')
          this.getSysConfigGroupList()
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('删除失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    creatSys () { // 新建系统配置
      this.sysModelShow = true
    },
    cancelEdit () { // 关闭系统配置model
      this.sysConfigVo = {}
      this.sysModelShow = false
      this.getSysConfigGroupList()
    },
    clickTr (i) {
      this.activeIndex = i
    },
    loginSuccess (result) { // 接收登入弹框返回的登入信息并转发给App.vue
      this.$emit('setLoginInfo', result) // 登入成功，显示导航栏
      console.log('弹窗登入成功')
      this.loginPopup = false
    }
  }
}
</script>

<style scoped>
</style>