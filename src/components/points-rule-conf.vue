<template>
<div>
  <legend class="search">
  	<div>
  	  <label for="title">名称：</label>
  	  <input type="text" name="title" v-model="pointsRuleVo.name" />
  	</div>
  	<div>
  	  <input type="radio" name="enabled" value="true" v-model="pointsRuleVo.enabled" />
  	  <label for="enabled">上架</label>
  	  <input type="radio" name="enabled" value="false" v-model="pointsRuleVo.enabled" />
  	  <label for="enabled">下架</label>
  	  <input type="radio" name="enabled" value="" v-model="pointsRuleVo.enabled" />
  	  <label for="enabled">全部</label>
  	</div>
  	<div>
  	  <label for="type">分类：</label>
  	  <select v-model="pointsRuleVo.type">
		    <option v-for="type in typeList" :value="type.value">{{ type.name }}</option>
      </select>
  	</div>
  	<div>
  	  <label for="lds">机务段：</label>
  	  <div class="category">
  	  	<input type="text" name="lds" :title="ldsName" v-model="ldsName" />
        <div class="categorySelect">
          <div class="btn-sm btn-default" style="margin: 10px 0 0 10px;" @click="selectAll">{{isSelect ? '取消' : '全选'}}</div>
          <ul style="margin-top: 0;">
            <li v-for="ld in ldList">
              <input type="checkbox" :value="ld" v-model="lds" />{{ ld.name }}
            </li>
          </ul>
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
  	<div class="btn-md btn-default" @click="pointsRuleQuery">查 询</div>
  	<div class="btn-md btn-default" @click="create">新 建</div>
  	<!--<div class="btn-md btn-default" @click="productEdit('1')">虚假编辑</div>-->
  </legend>
  <div class="table">
	<table style="min-width: 600px;width: 100%;" class="table-hover">
	  <colgroup>
		  <col />
		  <col />
		  <col />
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
	    <th>类型</th>
	    <th>关键字</th>
	    <th>名 称</th>
	    <th>生效时间</th>
	    <th>排列序号</th>
	    <th>创建时间/更新时间</th>
	    <th>参数值1</th>
	    <th>参数值2</th>
	    <th>参数值3</th>
	    <th>参数值4</th>
	    <th>参数值5</th>
	    <th>操作</th>
	  </thead>
	  <tbody>
        <tr v-for="(pointsRule, index) in pointsRuleList" @click="clickTr(index)" :class="{tableActive: activeIndex === index}">
          <td><div style="min-width:100px" v-text="ruleTypeList[pointsRule.type].name"></div></td>
          <td><div style="min-width:100px" v-text="pointsRule.key"></div></td>
          <td><div style="min-width:100px" v-text="pointsRule.name"></div></td>
          <td>
            <div style="min-width:160px;height: 26px;display: inline-block;" v-text="pointsRule.startedAt"></div>
            <br />
            <div style="min-width:160px;height: 26px;display: inline-block;" v-text="pointsRule.endedAt"></div>
          </td>
          <td><div style="min-width:70px" v-text="pointsRule.sortNum"></div></td>
          <td>
            <div style="min-width:160px;height: 26px;display: inline-block;" v-text="pointsRule.createdDt"></div>
            <br />
            <div style="min-width:160px;height: 26px;display: inline-block;" v-text="pointsRule.updatedDt"></div>
          </td>
          <td><div style="min-width:70px" v-text="pointsRule.param1"></div></td>
          <td><div style="min-width:70px" v-text="pointsRule.param2"></div></td>
          <td><div style="min-width:70px" v-text="pointsRule.param3"></div></td>
          <td><div style="min-width:70px" v-text="pointsRule.param4"></div></td>
          <td><div style="min-width:70px" v-text="pointsRule.param5"></div></td>
          <td style="min-width:110px">
            <div class="btn-sm btn-default btn-left" @click="pointsRuleEdit(pointsRule)">编辑</div>
            <div class="btn-sm btn-default" @click="pointsRuleDelete(pointsRule)">删除</div>
          </td>
        </tr>
	  </tbody>
	</table>
	<paginate :pageVo='pageVo' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
  </div>
  <div v-if="pointsRuleMod">
  	<points-rule :ldList='ldList' :params='pointsRule' :typeList='typeList' @cancel='cancel' @loginSuccess='loginSuccess'></points-rule>
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
import pointsRule from '@/components/points-rule-modal'
import Datepicker from 'vuejs-datepicker'
export default {
  name: 'pointsRuleConf',
  data () {
    return {
      loginPopup: false,
      pointsRuleMod: false,
      isSelect: false,
      activeIndex: -1,
      typeList: config.ruleTypeList,
      ldsName: '',
      ruleTypeList: [],
      count: 0,
      currentPage: 1,
      totalRecs: '',
      pageSize: 10,
      pageVo: {
        'prevText': '<<',
        'nextText': '>>'
      },
      pointsRuleVo: {
        'type': ''
      },
      validFrom: {},
      ldList: [],
      lds: [],
      pointsRuleList: [],
      validTo: {},
      pointsRule: {},
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
    pointsRule,
    Datepicker
  },
  mounted () {
    this.$nextTick(() => {
      this.getLdList()
      this.getRuleTypeList()
    })
  },
  methods: {
    getLdList () { // 获取分类列表
      this.axios({
        method: 'get',
        url: '/sys/org/ld/list'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.ldList = data.result.list
          this.pointsRuleQuery()
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
    pointsRuleQuery () { // 获取列表
      if (this.lds) {
        this.pointsRuleVo.orgSids = []
        for (let key in this.lds) {
          this.pointsRuleVo.orgSids.push(this.lds[key].sid)
        }
      }
      if (this.validFrom.date) {
        this.validFrom.date = config.dateToString(this.validFrom.date, 'yyyy-MM-dd')
        this.pointsRuleVo.validFrom = this.validFrom.date + ' ' + this.validFrom.time ? this.validFrom.time : '00:00:00'
      }
      if (this.validTo.date) {
        this.validTo.date = config.dateToString(this.validTo.date, 'yyyy-MM-dd')
        this.pointsRuleVo.validTo = this.validTo.date + ' ' + this.validTo.time ? this.validTo.time : '00:00:00'
      }
      this.axios({
        method: 'post',
        data: this.pointsRuleVo,
        params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
        url: '/sys/points-rule-conf/list'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.pointsRuleList = data.result.resultList
          this.currentPage = data.result.pageNo // 当前页
          this.count = data.result.totalPages // 总页数
          this.totalRecs = data.result.totalRecs
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
    pointsRuleDelete (pointsRule) { // 删除
      this.axios({
        method: 'get',
        params: {'sid': pointsRule.sid},
        url: '/sys/points-rule-conf/delete'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.pointsRuleQuery()
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
    pointsRuleEdit (pointsRule) { // 获取详情
      this.axios({
        method: 'get',
        params: {'sid': pointsRule.sid},
        url: '/sys/points-rule-conf/get'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.pointsRule = data.result
          this.pointsRuleMod = true // 打开产品编辑/新增模板
          console.log('~~~~~' + this.pointsRuleVo + '' + this.pointsRuleMod)
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
    getRuleTypeList () {
      for (let key in this.typeList) {
        this.ruleTypeList[this.typeList[key].value] = this.typeList[key]
      }
    },
    create () { // 新增
      this.pointsRuleMod = true
      this.pointsRule = {}
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
      for (let key in this.lds) {
        this.ldsName += this.lds[key].name + '、 '
      }
    },
    clickTr (i) {
      this.activeIndex = i
    },
    cancel () {
      this.pointsRuleMod = false
      this.pointsRuleQuery()
    },
    changePage (pageNo, pageSize) { // 切换页面
      console.log(pageNo)
      this.currentPage = pageNo
      this.pageSize = pageSize
      this.pointsRuleQuery()
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
</style>