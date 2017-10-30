<template>
<div>
  <legend class="search">
  	<div>
  		<label for="groupSid">字典分类：</label>
	    <select v-model="sysVo.groupSid">
		    <option v-for="groupCodeVo in groupCodeList" :value="groupCodeVo.sid">{{ groupCodeVo.name }}</option>
		  </select>
  	</div>
  	<div>
  		<label for="code">字典编码：</label>
	  	<input type="text" name="code" id="code" v-model="sysVo.code" />
  	</div>
  	<div>
  		<label for="name">字典名称：</label>
	  	<input type="text" name="name" id="name" v-model="sysVo.name" />
  	</div>
	  <div class="btn-md btn-default" @click="getSysConfigList">查 询</div>
	  <div class="btn-md btn-default" @click="creatSys">新 建</div>
  </legend>
  <div class="table">
		<table style="min-width: 600px;width: 100%;" class="table-hover">
			<colgroup>
				<col style="width:40px;"/>
				<col/>
				<col/>
				<col/>
				<col/>
				<col/>
			</colgroup>
			<thead>
			  <th style="min-width:40px;max-width: 50px;">序号</th>
			  <th>名称</th>
			  <th>code</th>
			  <th>分组code</th>
			  <th>分组名称</th>
			  <th></th>
			</thead>
			<tbody>
				<tr v-for="(sysConfig, index) in sysConfigList" @click="clickTr(index)" :class="{tableActive: activeIndex === index}">
					<td>
						<div v-text="index + 1"></div>
					</td>
					<td>
						<div style="min-width:80px" v-text="sysConfig.name"></div>
					</td>
					<td>
						<div style="min-width:80px" v-text="sysConfig.code"></div>
					</td>
					<td>
						<div style="min-width:80px" v-text="sysConfig.groupCode"></div>
					</td>
					<td>
						<div style="min-width:80px" v-text="sysConfig.groupName"></div>
					</td>
					<td style="width: 200px;">
						<div class="btn-sm btn-default btn-left" @click="sysEdit(sysConfig)">编辑</div>
						<div class="btn-sm btn-default" @click="sysDelete(sysConfig)">删除</div>
					</td>
				</tr>
			</tbody>
		</table>
		<paginate :pageVo='pageVo' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
	</div>
	<div v-if="sysModelShow">
		<sys-modal @cancelEdit="cancelEdit" :params="sysConfigVo" @loginSuccess='loginSuccess' :groupCodeList='groupCodeList'></sys-modal>
	</div>
  <div v-if="loginPopup">
  	<login-popup @loginSuccess='loginSuccess'></login-popup>
  </div>
</div>
</template>

<script>
import config from '@/components/config'
import loginPopup from '@/components/login-popup'
import paginate from '@/components/paginate'
import sysModal from '@/components/sys-modal'
export default {
  name: 'sys-config',
  data () {
    return {
      sysVo: {
        'groupSid': '',
        'code': '',
        'name': ''
      },
      files: [],
      currentPage: 1,
      totalRecs: '',
      pageSize: 10,
      count: 0,
      pageVo: {
        'prevText': '<<',
        'nextText': '>>'
      },
      activeIndex: -1, // 被选中的列表的index
      sysConfigVo: {},
      groupCodeList: [],
      sysConfigList: [],
      loginPopup: false,
      sysModelShow: false
    }
  },
  components: {
    loginPopup,
    paginate,
    sysModal
  },
  mounted () {
    this.$nextTick(() => {
      console.log('进入系统设置')
      this.getGroupCodeList()
      this.activeIndex = -1
    })
  },
  methods: {
    getGroupCodeList () { // 获取字典分类列表
      let firstItem = {
        'sid': '',
        'name': '请选择'
      }
      this.axios({
        method: 'post',
        data: {'code': '', 'name': ''},
        url: '/sys/sys-config-group/list'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          console.log('成功')
          this.groupCodeList = data.result.list
          this.groupCodeList.unshift(firstItem) // 添加默认选项，请选择
          this.sysVo.groupSid = '' // 选中默认选项
          this.getSysConfigList()
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
    getSysConfigList () { // 获取系统设置列表
      if (!this.sysVo.groupSid) {
        this.sysVo.groupSid = ''
      }
      this.axios({
        method: 'post',
//      method: 'get',
        url: '/sys/sys-config/list',
//      url: 'http://localhost:7080/static/sys-config.json'
        params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
        data: this.sysVo
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('成功')
          this.sysConfigList = data.result.resultList
          this.currentPage = data.result.pageNo // 当前页
          this.count = data.result.totalPages // 总页数
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
        url: '/sys/sys-config/get'
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
    sysDelete (sysConfig) {
      this.axios({
        method: 'get',
        params: {'sid': sysConfig.sid},
//      url: '/sys/sys-config/get?sid=135'
        url: '/sys/sys-config/delete'
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('删除成功')
          this.getSysConfigList()
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
      this.sysConfigVo = {
        'desc': '',
        'value1': '',
        'value2': '',
        'value3': '',
        'value4': ''
      }
    },
    cancelEdit () { // 关闭系统配置model
      this.sysConfigVo = {}
      this.sysModelShow = false
      this.getGroupCodeList()
    },
    clickTr (i) {
      this.activeIndex = i
    },
    loginSuccess (result) { // 接收登入弹框返回的登入信息并转发给App.vue
      this.$emit('setLoginInfo', result) // 登入成功，显示导航栏
      console.log('弹窗登入成功')
      this.loginPopup = false
    },
    changePage (pageNo, pageSize) { // 切换页面
      console.log(pageNo)
      this.currentPage = pageNo
      this.pageSize = pageSize
      this.getSysConfigList()
    },
    inputFilter (newFile, oldFile, prevent) {
      console.log('上传的文件：' + this.files)
    }
  }
}
</script>

<style scoped>
</style>