<template>
<div class="main">
  <legend class="search">
  	<div>
  	  <label for="orderNo">订单号：</label>
	  <input type="text" name="orderNo" v-model="orderVo.orderNo" />
  	</div>
  	<div>
  	  <label for="workNo">司机工号：</label>
	  <input type="text" name="workNo" v-model="orderVo.workNo" />
  	</div>
  	<div>
  	  <label for="name">时间范围：</label>
	    <datepicker v-model="from.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
  	  <input type="time" name="validFrom" v-model="from.time" style="width: 80px;padding: 0;height: 26px;" />
  	  <p> 到 </p>
      <datepicker v-model="to.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
      <input type="time" name="validTo" v-model="to.time" style="width: 80px;padding: 0;height: 26px;" />
  	</div>
  	<div>
  	  <label for="stateIds">状态：</label>
  	  <div class="category">
  	  	<input type="text" name="stateIds" :title="stateName" v-model="stateName" readonly/>
        <div class="categorySelect">
          <div class="btn-sm btn-default" style="margin: 10px 0 0 10px;" @click="selectAll">{{isSelect ? '取消' : '全选'}}</div>
          <ul style="margin-top: 0;">
            <li v-for="state in stateList">
              <input type="checkbox" :value="state" v-model="states" />{{ state.name }}
            </li>
          </ul>
        </div>
  	  </div>
  	</div>
    <div class="btn-md btn-default" @click="getOrderList">查 询</div>
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
        <col/>
        <col/>
        <col/>
        <col/>
      </colgroup>
      <thead>
        <th style="min-width:40px;max-width: 50px;">序号</th>
        <th>订单号</th>
        <th>司机工号</th>
        <th>姓名</th>
        <th>所需积分</th>
        <th>第三方平台</th>
        <th>货物名称</th>
        <th>状态</th>
        <th>下单时间</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="(order, index) in orderList" @click="clickTr(index)" :class="{tableActive: activeIndex === index}">
          <td>
            <div v-text="index + 1"></div>
          </td>
          <td><div style="min-width:100px" v-text="order.orderNo"></div></td>
          <td><div style="min-width:100px" v-text="order.workNo"></div></td>
          <td><div style="min-width:100px" v-text="order.name"></div></td>
          <td><div style="min-width:100px" v-text="order.points"></div></td>
          <td><div style="min-width:100px" v-text="order.outerPlatform"></div></td>
          <td><div style="min-width:100px" v-text="order.productName"></div></td>
          <td><div style="min-width:100px" v-text="orderStateList[order.status].name"></div></td>
          <td><div style="min-width:100px" v-text="order.createdDt"></div></td>
          <td style="width: 200px;">
            <div class="btn-sm btn-default" @click="orderEdit(order)">编辑</div>
          </td>
        </tr>
      </tbody>
    </table>
  <paginate :pageVo='pageVo' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
  </div>
  <div v-if="orderModelShow">
    <order-modal @cancelEdit="cancelEdit" :orderStateList='orderStateList' :params="order" @loginSuccess='loginSuccess'></order-modal>
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
import orderModal from '@/components/order-modal'
export default {
  name: 'order',
  data () {
    return {
      stateList: config.stateList,
      orderStateList: [],
      currentPage: 1,
      count: 0,
      pageSize: 10,
      totalRecs: '',
      states: [],
      stateName: '',
      pageVo: {
        'prevText': '<<',
        'nextText': '>>'
      },
      activeIndex: -1, // 被选中的列表的index
      orderVo: {
        'orderNo': '',
        'name': '',
        'from': '',
        'to': '',
        'statusList': ''
      }, // 查询条件
      order: {}, // 获得的订单详情
      orderList: [],
      loginPopup: false,
      orderModelShow: false,
      isSelect: false,
      from: {
        'date': '',
        'time': '00:00'
      },
      to: {
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
  components: {
    loginPopup,
    paginate,
    Datepicker,
    orderModal
  },
  watch: {
    states: 'stateChange'
  },
  mounted () {
    this.$nextTick(() => {
      console.log('进入系统设置')
      this.activeIndex = -1
      this.stateOrder()
    })
  },
  methods: {
    getOrderList () { // 获取系统设置列表
      this.orderVo.statusList = []
      for (let key in this.states) {
        this.orderVo.codes.push(this.states[key].code)
      }
      if (this.from.date) {
        this.from.date = config.dateToString(this.from.date, 'yyyy-MM-dd')
        this.orderVo.from = this.from.date + ' ' + this.from.time ? this.from.time : '00:00:00'
      }
      if (this.to.date) {
        this.to.date = config.dateToString(this.to.date, 'yyyy-MM-dd')
        this.orderVo.to = this.to.date + ' ' + this.to.time ? this.to.time : '00:00:00'
      }
      this.axios({
        method: 'post',
        url: '/sys/order/list',
        params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
        data: this.orderVo
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('成功')
          this.orderList = data.result.resultList
          for (let key = 0; key < this.orderList.length; key++) {
            this.orderList[key].stateName = this.orderStateList[this.orderList[key].status].name
          }
          this.currentPage = data.result.pageNo // 当前页
          this.count = data.result.totalPages // 总页数
          this.totalRecs = data.result.totalRecs
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
    orderEdit (order) { // 编辑
      this.axios({
        method: 'get',
        params: {'sid': order.sid},
        url: '/sys/order/detail'
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          this.order = data.result
          this.orderModelShow = true
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
    stateChange () { // 在分类里显示已选分类
      this.stateName = ''
      for (let key in this.states) {
        this.stateName += this.states[key].name + '、 '
      }
    },
    selectAll () {
      this.isSelect = !this.isSelect
      this.states = []
      if (this.isSelect) {
        for (var i = 0; i < this.stateList.length; i++) {
          this.states.push(this.stateList[i])
        }
      }
    },
    stateOrder () { // 生产orderStateLst
      for (let key in this.stateList) {
        this.orderStateList[this.stateList[key].code] = this.stateList[key]
      }
      this.getOrderList()
    },
    creatOrder () { // 新建系统配置
      this.orderModelShow = true
    },
    cancelEdit () { // 关闭系统配置model
      this.sysConfigVo = {}
      this.orderModelShow = false
      this.getOrderList()
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
      this.getOrderList()
    }
  }
}
</script>

<style scoped>
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
</style>