<template>
<div>
  <legend class="search">
  	<div>
  	  <label for="driNo">司机工号：</label>
  	  <input type="text" name="driNo" v-model="userPointVo.workNo" />
  	</div>
  	<div>
  	  <label for="type">类型：</label>
  	  <select v-model="userPointVo.reason">
		    <option v-for="reason in reasonList" :value="reason.value">{{ reason.name }}</option>
      </select>
  	</div>
  	<div>
  	  <label for="from">时间范围：</label>
  	  <datepicker v-model="from.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
  	  <input type="time" name="from" v-model="from.time" style="width: 80px;padding: 0;height: 26px;" />
  	  <p>到</p>
      <datepicker v-model="to.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
      <input type="time" name="to" v-model="to.time" style="width: 80px;padding: 0;height: 26px;" />
  	</div>
  	<div class="btn-md btn-default" @click="userPointsQuery">查 询</div>
  </legend>
  <div class="table">
	<table style="min-width: 600px;width: 100%;" class="table-hover">
	  <colgroup>
		<col style="width:40px;" />
		<col />
		<col />
		<col />
		<col />
		<col />
		<col />
		<col />
		<col />
		<!--<col />-->
		<col />
		<col />
		<col />
		<col />
	  </colgroup>
	  <thead>
	    <th style="width:40px">序号</th>
	    <th>司机工号</th>
	    <th>出勤sid</th>
	    <th>规则sid</th>
	    <th>规则名称</th>
	    <th>车次记录sid</th>
	    <th>车次号</th>
	    <th>订单记录sid</th>
	    <th>积分变动理由</th>
	    <!--<th>计算积分的参数</th>-->
	    <th>积分变动</th>
	    <th>变动之后的值</th>
	    <th>创建时间</th>
	    <th></th>
	  </thead>
	  <tbody>
      <tr v-for="(userPoint, index) in userPointList" @click="clickTr(index)" :class="{tableActive: activeIndex === index}">
	      <td>
          <div v-text="index + 1"></div>
        </td>
        <td><div style="min-width:60px;" v-text="userPoint.workNo"></div></td>
        <td><div style="min-width:60px;" v-text="userPoint.onDutySid"></div></td>
        <td><div style="min-width:60px;" v-text="userPoint.confSid"></div></td>
        <td><div style="min-width:140px;" v-text="userPoint.confName"></div></td>
        <td><div style="min-width:60px;" v-text="userPoint.trainSid"></div></td>
        <td><div style="min-width:60px;" v-text="userPoint.trainNo"></div></td>
        <td><div style="min-width:60px;" v-text="userPoint.orderSid"></div></td>
        <td><div style="min-width:60px;" v-text="userPoint.reason"></div></td>
        <!--<td><div style="min-width:100px;width: 10%;" v-text="userPoint.params"></div></td>-->
        <td><div style="min-width:100px;" v-text="userPoint.changed"></div></td>
        <td><div style="min-width:100px;" v-text="userPoint.balance"></div></td>
        <td><div style="min-width:100px;" v-text="userPoint.createdDt"></div></td>
        <td><div class="btn-md btn-default" @click="look(userPoint)">查看参数</div></td>
      </tr>
	  </tbody>
	</table>
	<paginate :pageVo='pageVo' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
  </div>
  <div v-if="paramsShow">
    <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
    <div class="popup" style="left: 30%;top: 100px;width: 900px;font-size: 16px;height: 600px;overflow: auto;">
      <div class="head" style="text-align: center;width: 900px;">
	      <h3></h3>
	  	  <i class="icon-remove icon-white" @click="cancelParams()"></i>			  	
	    </div>
	    <table>
	  	  <tr>
	  	    <td class="tdRight">司机工号:</td>
	  	    <td>
	  	    	<span v-text="pointsVo.workNo"></span>
	  	    </td>
	   	  </tr>
	  	  <tr>
	  	    <td class="tdRight">出勤sid:	</td>
	  	    <td>
	  	      <span v-text="pointsVo.onDutySid"></span>
	  	    </td>
	  	  </tr>
	  	  <tr>
	  	    <td class="tdRight">规则sid:</td>
	  	    <td>
	  	      <span v-text="pointsVo.confSid"></span>
	  	    </td>
	  	  </tr>
	  	  <tr>
	  	    <td class="tdRight">规则名称:</td>
	  	    <td>
	  	      <span v-text="pointsVo.confName"></span>
	  	    </td>
	      </tr>
	      <tr>
	  	    <td class="tdRight">车次记录sid:</td>
	  	    <td>
	  	      <span v-text="pointsVo.trainSid"></span>
	  	    </td>
	      </tr>
	      <tr>
	  	    <td class="tdRight" style="vertical-align: top;">参数:</td>
	  	    <td style="border: 1px dashed #999;background: #ccc;">
	  	      <div v-html="params_stringify"></div>
	  	    </td>
	      </tr>
	  	  <tr>
	  	    <td class="tdRight">车次号:</td>
	  	    <td>
	  	      <span v-text="pointsVo.trainNo"></span>
	  	    </td>
	  	  </tr>
	  	  <tr>
	  	    <td class="tdRight">订单记录sid:</td>
	  	    <td>
	  	      <span v-text="pointsVo.orderSid"></span>
	  	    </td>
	  	  </tr>
	  	  <tr>
	  	    <td class="tdRight">积分变动理由:</td>
	  	    <td>
	  	    	<span v-text="pointsVo.reason"></span>
	  	    </td>
	  	  </tr>
	  	  <tr>
	  	    <td class="tdRight">积分变动:</td>
	  	    <td>
	  	    	<span v-text="pointsVo.changed"></span>
	  	    </td>
	  	  </tr>
	  	  <tr>
	  	    <td class="tdRight">变动之后的值:</td>
	  	    <td>
	  	    	<span v-text="pointsVo.balance"></span>
	  	    </td>
	  	  </tr>
	  	  <tr>
	  	    <td class="tdRight">创建时间:</td>
	  	    <td>
	  	    	<span v-text="pointsVo.createdDt"></span>
	  	    </td>
	  	  </tr>
	  	</table>
    </div>
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
import Datepicker from 'vuejs-datepicker'
export default {
  name: 'userPoints',
  data () {
    return {
      currentPage: 1,
      count: 0,
      totalRecs: '',
      pageSize: 10,
      reasonList: config.pointsOrExperienceReasonList,
      pageVo: {
        'prevText': '<<',
        'nextText': '>>'
      },
      userPointVo: {
        'type': 1
      },
      activeIndex: -1,
      params_stringify: '',
      paramsShow: false,
      userPointList: [],
      loginPopup: false,
      pointsVo: {},
      from: {},
      to: {},
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
  components: {
    loginPopup,
    paginate,
    Datepicker
  },
  mounted () {
    this.$nextTick(() => {
      this.userPointsQuery()
    })
  },
  methods: {
    userPointsQuery () { // 获取商品列表
      if (this.from.date) {
        this.from.date = config.dateToString(this.from.date, 'yyyy-MM-dd')
        this.consultVo.from = this.from.date + ' ' + this.from.time ? this.from.time : '00:00:00'
      }
      if (this.to.date) {
        this.to.date = config.dateToString(this.to.date, 'yyyy-MM-dd')
        this.consultVo.to = this.to.date + ' ' + this.to.time ? this.to.time : '00:00:00'
      }
      this.axios({
        method: 'post',
        data: this.userPointVo,
        params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
        url: 'sys/points-experience/list'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.userPointList = data.result.resultList
          this.currentPage = data.result.pageNo // 当前页
          this.count = data.result.totalPages // 总页数
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('积分列表获取失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    look (userPoint) {
      this.pointsVo = userPoint
      if (userPoint.params) {
        let json = JSON.parse(userPoint.params)
        this.params_stringify = JSON.stringify(json, null, 2)
        this.params_stringify = `
          <pre>${this.params_stringify}</pre>
        `
      }
      this.paramsShow = true
    },
    cancelParams () {
      this.paramsShow = false
    },
    clickTr (i) {
      this.activeIndex = i
    },
    changePage (pageNo, pageSize) { // 切换页面
      console.log(pageNo)
      this.currentPage = pageNo
      this.pageSize = pageSize
      this.userPointsQuery()
    },
    loginSuccess (result) { // 登入成功（从弹窗登入成功）
      this.loginPopup = false
      this.$emit('setLoginInfo', result)
      console.log('弹窗登入成功')
    }
  }
}
</script>

<style scoped>
p{
  display: inline-block;
}
.vdp-datepicker{
  width: auto;
  margin: 0;
  padding: 0;
}
</style>