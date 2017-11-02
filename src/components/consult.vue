<template>
<div>
  <legend class="search">
  	<div>
  	  <label for="title">名称：</label>
  	  <input type="text" name="title" v-model="consultVo.title" />
  	</div>
  	<div>
  	  <input type="radio" name="enabled" value="true" v-model="consultVo.enabled" />
  	  <label for="enabled">上架：</label>
  	  <input type="radio" name="enabled" value="false" v-model="consultVo.enabled" />
  	  <label for="enabled">下架：</label>
  	</div>
  	<div>
  	  <label for="type">类型：</label>
  	  <select v-model="consultVo.type">
		    <option v-for="type in typeList" :value="type.value">{{ type.name }}</option>
      </select>
  	</div>
  	<div>
  	  <label for="lds">机务段：</label>
  	  <div class="category">
  	  	<input type="text" name="lds" :title="ldsName" v-model="ldsName" readonly />
        <div class="categorySelect">
          <div class="btn-sm btn-default" style="margin: 10px 0 0 10px;display: block;" @click="selectAll">{{isSelect ? '取消' : '全选'}}</div>
          <li v-for="ld in ldList">
            <input type="checkbox" :value="ld" v-model="lds" />{{ ld.name }}
          </li>
        </div>
  	  </div>
  	</div>
  	<div class="time-pick">
  	  <label for="comValidFrom">上下架时间段：</label>
  	  <datepicker v-model="validFrom.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
  	  <input type="time" name="validFrom" v-model="validFrom.time" style="width: 80px;padding: 0;height: 26px;" />
  	  <p>到</p>
      <datepicker v-model="validTo.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
      <input type="time" name="validTo" v-model="validTo.time" style="width: 80px;padding: 0;height: 26px;" />
  	</div>
  	<div class="btn-md btn-default" @click="consultQuery">查 询</div>
  	<div class="btn-md btn-default" @click="create">新 建</div>
  	<!--<div class="btn-md btn-default" @click="productEdit('1')">虚假编辑</div>-->
  </legend>
  <div class="table">
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
		  <col />
		  <col />
	  </colgroup>
	  <thead>
	    <th style="min-width:40px;max-width: 50px;">序号</th>
	    <th>创建时间/更新时间</th>
	    <th>标 题</th>
	    <th>机务段</th>
	    <th>图 片</th>
	    <th>发布时间</th>
	    <th>状态</th>
	    <th>排序</th>
	    <th>生效时间</th>
	    <th>操作</th>
	  </thead>
	  <tbody>
      <tr v-for="(consult, index) in consultList" @click="clickTr(index)" :class="{tableActive: activeIndex === index}">
	      <td>
          <div>{{ index - 9 + currentPage*10 }}</div>
       </td>
        <td>
          <div style="min-width:160px;height: 26px;display: inline-block;" v-text="consult.createdDt"></div>
          <br />
          <div style="min-width:160px;height: 26px;display: inline-block;" v-text="consult.updatedDt"></div>
        </td>
        <td style="min-width:100px;max-width: 200px;"><div :title="consult.title" v-text="consult.title"></div></td>
        <td style="min-width:100px;"><div>{{ orderLdList[consult.orgSid] ? orderLdList[consult.orgSid].name : '' }}</div></td>
        <td><img style="vertical-align: bottom;" :src="consult.imageUrl" width="70"/></td>
        <td><div style="min-width:100px" v-text="consult.releasedAt"></div></td>
        <td><div style="min-width:60px">{{ consult.enabled ? '上架' : '下架' }}</div></td>
        <td><div style="min-width:60px" v-text="consult.sortNum"></div></td>
        <td style="max-width: 250px;">
          <div style="min-width:160px;height: 26px;display: inline-block;" v-text="consult.startedAt"></div>
          <br />
          <div style="min-width:160px;height: 26px;display: inline-block;" v-text="consult.endedAt"></div>
        </td>
        <td style="min-width:120px">
        	<div>
        	  <div class="btn-sm btn-default btn-left" @click="consultEdit(consult)">编辑</div>
        	  <div class="btn-sm btn-default" @click="consultDelete(consult)">删除</div>
        	</div>
        	<div>
        	  <a class="btn-a" :href="consult.url" target="_blank">点击跳转</a>
        	</div>
        </td>
      </tr>
	  </tbody>
	</table>
	<paginate :pageVo='pageVo' :totalRecs='totalRecs' :pageSize='pageSize' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
  </div>
  <div v-if="consultMod">
  	<consult-modal :ldList='ldList' :params='consult' :typeList='typeList' @cancel='cancel' @loginSuccess='loginSuccess'></consult-modal>
  </div>
  <div v-if="loginPopup">
  	<login-popup @loginSuccess='loginSuccess'></login-popup>
  </div>
</div>
</template>

<script>
// todo 时间插件
import config from '@/components/config'
import loginPopup from '@/components/login-popup'
import paginate from '@/components/paginate'
import consultModal from '@/components/consult-modal'
import Datepicker from 'vuejs-datepicker'
export default {
  name: 'information',
  data () {
    return {
      loginPopup: false,
      consultMod: false,
      isSelect: false,
      activeIndex: -1,
      typeList: config.typeList,
      count: 0,
      currentPage: 1,
      pageSize: 10,
      totalRecs: '',
      consultList: [],
      orderLdList: [],
      ldsName: '',
      pageVo: {
        'prevText': '<<',
        'nextText': '>>'
      },
      consultVo: {
        'type': 1
      },
      ldList: [],
      lds: [],
      validFrom: {
        'time': '00:00'
      },
      validTo: {
        'time': '00:00'
      },
      consult: {},
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
  watch: {
    lds: 'ldsChange',
    deep: true
  },
  components: {
    loginPopup,
    paginate,
    consultModal,
    Datepicker
  },
  mounted () {
    this.$nextTick(() => {
      this.getLdList()
    })
  },
  methods: {
    getLdList () { // 获取机务段列表
      this.axios({
        method: 'get',
        url: '/sys/org/ld/list'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.ldList = data.result.list
          this.ldListOrder()
          this.consultQuery()
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('商品分类列表获取失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    consultQuery () { // 获取列表
      if (this.lds) {
        this.consultVo.orgSids = []
        for (let key in this.lds) {
          this.consultVo.orgSids.push(this.lds[key].sid)
        }
      }
      if (this.validFrom.date) {
        this.validFrom.date = config.dateToString(new Date(this.validFrom.date), 'yyyy-MM-dd')
        this.consultVo.validFrom = this.validFrom.date + ' ' + (this.validFrom.time ? this.validFrom.time + ':00' : '00:00:00')
      }
      if (this.validTo.date) {
        this.validTo.date = config.dateToString(new Date(this.validTo.date), 'yyyy-MM-dd')
        this.consultVo.validTo = this.validTo.date + ' ' + (this.validTo.time ? this.validTo.time + ':00' : '00:00:00')
      }
      if (this.consultVo.orgSids.length === this.ldList.length) {
        this.consultVo.orgSids = []
      }
      this.axios({
        method: 'post',
        data: this.consultVo,
        params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
        url: '/sys/cms/static-page/list'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.consultList = data.result.resultList
          this.currentPage = data.result.pageNo // 当前页
          this.totalRecs = data.result.totalRecs
          this.count = data.result.totalPages // 总页数
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('商品列表获取失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    consultDelete (consult) { // 删除
      this.axios({
        method: 'get',
        params: {'sid': consult.sid},
        url: '/sys/cms/static-page/delete'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.consultQuery()
          console.log('删除成功')
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
    consultEdit (consult) { // 获取商品详情
      this.axios({
        method: 'get',
        params: {'sid': consult.sid},
        url: '/sys/cms/static-page/get'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.consult = data.result
          this.consultMod = true // 打开产品编辑/新增模板
          console.log('~~~~~' + this.consultVo + '' + this.consultMod)
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('商品详情获取失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    ldListOrder () { // 整理机务段列表
      for (let key in this.ldList) {
        this.orderLdList[this.ldList[key].sid] = this.ldList[key]
      }
    },
    create () { // 新增
      this.consultMod = true
      this.consult = {}
    },
    selectAll () {
      this.isSelect = !this.isSelect
      this.lds = []
      if (this.isSelect) {
        for (var i = 0; i < this.ldList.length; i++) {
          this.lds.push(this.ldList[i])
        }
      }
    },
    ldsChange () { // 在分类里显示已选分类
      this.ldsName = ''
      let nameList = []
      for (let key in this.lds) {
        nameList.push(this.lds[key].name)
      }
      this.ldsName = nameList.join('.')
    },
    clickTr (i) {
      this.activeIndex = i
    },
    cancel () {
      this.consultMod = false
      this.consultQuery()
    },
    changePage (pageNo, pageSize) { // 切换页面
      console.log(pageNo)
      this.currentPage = pageNo
      this.pageSize = pageSize
      this.consultQuery()
    },
    loginSuccess (result) { // 接收登入弹框返回的登入信息并转发给App.vue or 接收从编辑新建弹框传过来的登入信息
      this.$emit('setLoginInfo', result) // 登入成功，显示导航栏
      console.log('弹窗登入成功')
      this.loginPopup = false
    }
  }
}
</script>

<style>
.category{
  position: relative;
}
.categorySelect{
  margin: 0 !important;
  display: none !important;
  background: #fff;
  width: 200px;
  height: 200px;
  position: absolute;
  border: 1px solid #ccc;
  overflow: auto;
  font-size: 16px;
}
.categorySelect input{
  height: 16px !important;
  width: auto !important;
}
.category:hover > .categorySelect{
  display: inline-block !important;
}
p{
  display: inline-block;
  margin: 0;
}
.categorySelect li input[type='checkbox']{
  margin: 0;
  position: relative;
  top: 3px;
  width: 14px !important;
}	
.enabled{
  box-shadow: 2px 2px 2px #337AB7;
}
input[type='checkbox']{
  padding: 0px !important;
  border-radius: 0px !important;
}
.btn-a{
  cursor: pointer;
}
</style>