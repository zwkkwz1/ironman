<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div class="popup" style="width: 1000px;padding: 20px;left: 25%;overflow: auto;">
    <div class="head" style="text-align: center;width: 1040px;margin-left: -20px;">
	    <h3></h3>
		  <i class="icon-remove icon-white" @click="cancelEdit()"></i>			  	
	  </div>
  	<legend>
  	  <title style="width: 100%;">订单信息</title>
  	</legend>
  	<div class="choose">
  	  <div >
  	    <span class="tdRight">订单编号：</span>
  	    <span class="tdLeft" v-text="params.orderNo"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">商品名称：</span>
  	    <span class="tdLeft" v-text="params.productName"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">第三方平台：</span>
  	    <span class="tdLeft" v-text="params.outerPlatform"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">第三方账号：</span>
  	    <span class="tdLeft" v-text="params.outerAccount"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">下单时间：</span>
  	    <span class="tdLeft" v-text="params.createdDt"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">物流单号：</span>
  	    <span class="tdLeft" v-text="params.shipmentNo"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">物流公司：</span>
  	    <span class="tdLeft" v-text="params.shipmentName"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">商品名称：</span>
  	    <span class="tdLeft" v-text="params.productName"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">兑换需要的积分：</span>
  	    <span class="tdLeft" v-text="params.points"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">数量：</span>
  	    <span class="tdLeft" v-text="params.qty"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">外部平台订单号：</span>
  	    <span class="tdLeft" v-text="params.outerOrderId"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">外部平台的订单金额：</span>
  	    <span class="tdLeft">{{'支付金额：' + params.outerOrderPaidPrice + ' 原价：' + params.outerOrderPrice}}</span>
  	  </div>
  	  <div>
  	    <span class="tdRight">下单人信息：</span>
  	    <span class="tdLeft">{{'姓名：' + params.name + '。工号：' + params.workNo + '。手机号：' + params.mobile}}</span>
  	  </div>
  	  <div>
  	    <span class="tdRight">收货人信息：</span>
  	    <span class="tdLeft">{{'姓名：' + params.shippingName + '。手机号：' + params.shippingPhone + '。地址：' + params.shippingAddress}}</span>
  	  </div>
  	  <div>
  	    <span class="tdRight">外部平台的商品名称：</span>
  	    <span class="tdLeft" v-text="params.outerProductName"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">外部平台的商品编号：</span>
  	    <span class="tdLeft" v-text="params.outerProductNo"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">外部平台商品链接：</span>
  	    <span class="tdLeft" v-text="params.outerProductUrl"></span>
  	  </div>
  	  <div>
  	    <span class="tdRight">外部平台商品单价：</span>
  	    <span class="tdLeft" v-text="params.outerProductPrice"></span>
  	  </div>
  	</div>
  	<div style="text-align: right;margin: 10px 0;">
  	  <div class="btn-md btn-default btn-order" @click="creatDesc">新增备注</div>
  	  <div class="btn-md btn-default btn-order" @click="creatStatus">修改状态</div>
  	  <div class="btn-md btn-default btn-order" @click="creatOrder">第三方订单信息</div>
  	  <div class="btn-md btn-default btn-order" @click="creatlogistics">第三方发货信息</div>
  	</div>
  	<div class="table">
	    <table style="min-width: 600px;width: 100%;" class="table-hover">
	      <colgroup>
	        <col style="width:40px;"/>
	        <col/>
	        <col/>
	        <col/>
	        <col/>
	      </colgroup>
	      <thead>
	        <th style="min-width:40px;max-width: 50px;">序号</th>
	        <th>时间</th>
	        <th>状态变化</th>
	        <th>备注</th>
	        <th>图片</th>
	      </thead>
	      <tbody>
	        <tr v-for="(memo, index) in memoList" @click="clickTr(index)" :class="{tableActive: activeIndex === index}">
	          <td>
	            <div v-text="index + 1"></div>
	          </td>
	          <td><div style="min-width:100px" v-text="memo.createdDt"></div></td>
	          <td><div style="min-width:100px">{{orderStateList[memo.preStatus].name + '→' + orderStateList[memo.postStatus].name}}</div></td>
	          <td><div style="min-width:200px" v-text="memo.memo"></div></td>
	          <td><img height="70" style="vertical-align: bottom;" v-for="img in memo.images" :src="img"  @click="originalImg(img)"/></td>
	        </tr>
	      </tbody>
	    </table>
	  </div>
  	<p class="err-msg" style="display: block;left: 78px;" v-text="errMsg"></p>
  	<div v-if="showOriginal" class="popup" style="left: 650px;top: 150px;width: auto;height: auto;" v-drag>
      <div class="img-head" style="text-align: center;">
        <h3></h3>
        <i class="icon-remove icon-white" @click="closeOriginalImg" style="top: -18px;"></i>			  	
      </div>
      <img :src="originalUrl" alt="图片加载失败！！"/>
    </div>
  	<div v-if="loginPopup">
	  	<login-popup @loginSuccess='loginSuccess'></login-popup>
	  </div>
	  <div v-if="memoModalShow">
      <memo-modal @cancel="modalEdit" :sid='params.sid' :type="modalType" @loginSuccess='loginSuccess'></memo-modal>
    </div>
    <div v-if="creatOrderShow">
      <order-creat @cancel="modalEdit" :params='params' @loginSuccess='loginSuccess'></order-creat>
    </div>
    <div v-if="logisticsModalShow">
      <logistics-modal @cancel="modalEdit" :params='params' @loginSuccess='loginSuccess'></logistics-modal>
    </div>
  </div>
</div>
</template>

<script>
import config from '@/components/config'
import loginPopup from '@/components/login-popup'
import memoModal from '@/components/memo-modal'
import orderCreat from '@/components/order-creat'
import logisticsModal from '@/components/logistics-modal'
export default {
  data () {
    return {
      errMsg: '',
      loginPopup: false,
      memoList: [],
      modalType: 0,
      memoModalShow: false,
      creatOrderShow: false,
      logisticsModalShow: false,
      showOriginal: false,
      originalUrl: '',
      activeIndex: -1
    }
  },
  props: ['params', 'orderStateList'],
  mounted () {
    this.$nextTick(() => {
      console.log('|||||||' + this.params.sid)
      this.getMemoList()
      this.memoModalShow = false
      this.creatOrderShow = false
      this.logisticsModalShow = false
    })
  },
  components: {
    loginPopup,
    memoModal,
    orderCreat,
    logisticsModal
  },
  methods: {
    getMemoList () {
      this.axios({
        method: 'get',
        url: '/sys/order/memo/list',
        params: {'orderSid': this.params.sid}
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('跟新成功')
          this.memoList = data.result.list
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          this.errMsg = '获取备注列表失败'
          this.hideMsg()
        }
      }).catch((error) => {
        console.log('error信息是：' + error)
      })
    },
    freshOrder () { // 刷新订单详情
      this.axios({
        method: 'get',
        params: {'sid': this.params.sid},
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
    creatDesc () { // 新增备注
      this.memoModalShow = true
      this.modalType = 1
    },
    creatStatus () { // 新增状态
      this.memoModalShow = true
      this.modalType = 2
    },
    creatOrder () { // 修改新增订单信息
      this.creatOrderShow = true
    },
    creatlogistics () { // 修改新增物流信息
      this.logisticsModalShow = true
    },
    originalImg (imgUrl) { // 显示原图
      this.showOriginal = true
      this.originalUrl = imgUrl
    },
    closeOriginalImg () {
      this.showOriginal = false
    },
    hideMsg () {
      setTimeout(() => {
        this.errMsg = ''
      }, 5000)
    },
    modalEdit () { // 关闭系统配置model
      this.memoModalShow = false
      this.creatOrderShow = false
      this.logisticsModalShow = false
      this.getMemoList() // 刷新备注列表
      this.freshOrder() // 刷新订单信息
    },
    cancelEdit () {
      this.$emit('cancelEdit')
    },
    loginSuccess (result) { // 接收登入弹框传回的登入信息并转发给父组件
      this.$emit('loginSuccess', result)
      this.loginPopup = false
      console.log('弹窗登入成功')
    }
  }
}
</script>

<style scoped>
.popup{
  width: 560px;
  height: 600px;
  top: 100px;
  left: 679.5px;
}
.choose div{
  display: inline-block;
}
.btn-table{
  position: relative;
  left: 115px;
}
.btn-order{
  text-align: center;
  width: 150px;
  height: 25px;
  font-size: 15px;
  background-color: #f0f0f0;
}
.tdRight{
  display: inline-block;
  width: 160px;
  vertical-align: top;
}
.tdLeft{
  display: inline-block;
  width: 315px;
}
.table thead th{
  height: 25px;
}
.addTrainNo:after{
  left: 0 !important;
}
</style>