<template>
<div>
  <legend class="search">
  	<div>
  	  <label for="comName">名称：</label>
  	  <input type="text" name="comName" v-model="comVo.name" :readonly="false" />
  	</div>
  	<div>
  	  <label for="preview">可预览状态：</label>
  	  <select v-model="comVo.preview">
		    <option v-for="comPreview in comPreviewList" :value="comPreview.preview">{{ comPreview.previewName }}</option>
      </select>
  	</div>
  	<div>
  	  <label for="enabled">上下架状态：</label>
  	  <select v-model="comVo.enabled">
		    <option v-for="comEnabled in comEnabledList" :value="comEnabled.enabled">{{ comEnabled.enabledName }}</option>
      </select>
  	</div>
  	<div>
  	  <label for="categorySids">分类：</label>
  	  <div class="category">
  	  	<input type="text" name="categorySids" id="categorySids" :title="categorysName" v-model="categorysName" />
        <div class="categorySelect">
          <div class="btn-sm btn-default" style="margin: 10px 0 0 10px;" @click="selectAll">{{isSelect ? '取消' : '全选'}}</div>
          <ul style="margin-top: 0;">
            <li v-for="category in categoryList">
              <input type="checkbox" :value="category" v-model="categorys" />{{ category.name }}
            </li>
          </ul>
        </div>
  	  </div>
  	</div>
  	<div>
  	  <label for="points">价格段：</label>
  	  <input type="text" name="pointsFrom" style="width: 80px;padding-left: 10px;" v-model="comVo.pointsFrom" />
  	  <p>-</p>
  	  <input type="text" name="pointsTo" style="width: 80px;padding-left: 10px;" v-model="comVo.pointsTo" />
  	</div>
  	<div class="time-pick">
  	  <label for="comValidFrom">上下架时间段：</label>
  	  <!--<input type="text" name="comValidFrom" v-model="comVo.validFrom" />-->
  	  <datepicker v-model="validFrom.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
  	  <input type="time" name="validFrom" v-model="validFrom.time" style="width: 80px;padding: 0;height: 26px;" />
  	  <p> 到 </p>
      <datepicker v-model="validTo.date" language="zh" :highlighted="state.highlighted" :format="state.format"></datepicker>
      <input type="time" name="validTo" v-model="validTo.time" style="width: 80px;padding: 0;height: 26px;" />
  	</div>
  	<div class="btn-md btn-default" @click="productQuery">查 询</div>
  	<div class="btn-md btn-default" @click="create">新 建</div>
  	<!--<div class="btn-md btn-default" @click="productEdit('1')">虚假编辑</div>-->
  </legend>
  <div class="table">
	<table style="min-width: 600px;width: 100%;" class="table-hover">
	  <colgroup>
		<col />
		<col />
		<col />
		<!--<col />-->
		<col />
		<col />
		<col />
		<col />
		<col />
	  </colgroup>
	  <thead>
	    <th>图 片</th>
	    <th>商品名称</th>
	    <th>所属分类</th>
	    <th>预览</th>
	    <th>兑换所需积分</th>
	    <!--<th>兑换经验值门槛</th>-->
	    <th>排列序号</th>
	    <th>上下架时间</th>
	    <th>操作</th>
	  </thead>
	  <tbody>
        <tr v-for="(product, index) in productList" @click="clickTr(index)" :class="{tableActive: activeIndex === index}">
          <td>
            <img style="vertical-align: bottom;" width="70" :src="product.imageUrl"/>
          </td>
          <td><div style="min-width:100px" v-text="product.name"></div></td>
          <td><div style="min-width:100px" v-text="product.categoryName"></div></td>
          <td><div style="min-width:100px">{{ product.preview ? '是' : '否' }}</div></td>
          <td><div style="min-width:100px" v-text="product.points"></div></td>
          <!--<td><div style="min-width:100px" v-text="product.experience"></div></td>-->
          <td><div style="min-width:100px" v-text="product.sortNum"></div></td>
          <td>
            <div style="min-width:160px;display: inline-block;height: 26px;" v-text="product.startedAt"></div>
            <div style="min-width:160px;display: inline-block;height: 26px;" v-text="product.endedAt"></div>
          </td>
          <td style="min-width: 160px;">
            <div class="btn-sm btn-default btn-left" @click="productEdit(product)">编辑</div>
            <div class="btn-sm btn-default" @click="productEnabled(product)">{{(product.enabled && !product.preview) ? '下架' : '上架'}}</div>
          </td>
        </tr>
	  </tbody>
	</table>
	<paginate :pageVo='pageVo' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
  </div>
  <div v-if="productMod">
  	<product-modal :params='productVo' :categoryList='categoryList' @cancel='cancel' @loginSuccess='loginSuccess'></product-modal>
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
import productModal from '@/components/product-modal'
import Datepicker from 'vuejs-datepicker'
export default {
  name: 'commodityAdmin',
  data () {
    return {
      loginPopup: false,
      productMod: false,
      isSelect: false,
      activeIndex: -1,
      categorysName: '',
      productVo: [],
      currentPage: 1,
      validFrom: {},
      validTo: {},
      count: 0,
      pageSize: 10,
      totalRecs: '',
      pageVo: {
        'prevText': '<<',
        'nextText': '>>'
      },
      comVo: {},
      points: {},
      productList: [],
      categoryList: [],
      categorys: [],
      comEnabledList: [{
        'enabled': '',
        'enabledName': '全部'
      }, {
        'enabled': true,
        'enabledName': '已上架'
      }, {
        'enabled': false,
        'enabledName': '已下架'
      }],
      comPreviewList: [{
        'preview': '',
        'previewName': '全部'
      }, {
        'preview': true,
        'previewName': '可预览'
      }, {
        'preview': false,
        'previewName': '不可预览'
      }],
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
    categorys: 'categorysChange'
  },
  components: {
    loginPopup,
    paginate,
    productModal,
    Datepicker
  },
  mounted () {
    this.$nextTick(() => {
      this.productQuery()
      this.getProductCategoryList()
    })
  },
  methods: {
    getProductCategoryList () { // 获取分类列表
      this.axios({
        method: 'get',
        url: '/sys/product-category/list'
//      url: 'http://localhost:7080/static/category.json'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.categoryList = data.result.list
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
    productQuery () { // 获取商品列表
      if (this.categorys) {
        this.comVo.categorySids = []
        for (let key in this.categorys) {
          this.comVo.categorySids.push(this.categorys[key].sid)
        }
      }
      if (this.validFrom.date) {
        this.validFrom.date = config.dateToString(this.validFrom.date, 'yyyy-MM-dd')
        this.comVo.validFrom = this.validFrom.date + ' ' + this.validFrom.time ? this.validFrom.time : '00:00:00'
      }
      if (this.validTo.date) {
        this.validTo.date = config.dateToString(this.validTo.date, 'yyyy-MM-dd')
        this.comVo.validTo = this.validTo.date + ' ' + this.validTo.time ? this.validTo.time : '00:00:00'
      }
      this.axios({
        method: 'post',
        data: this.comVo,
        params: {'pageNo': this.currentPage, 'pageSize': this.pageSize},
        url: '/sys/product/list'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.productList = data.result.resultList
          this.currentPage = data.result.pageNo // 当前页
          this.count = data.result.totalPages // 总页数
          this.totalRecs = data.result.totalRecs // 总条数
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
    productEnabled (product) { // 商品上下架
      this.axios({
        method: 'get',
        params: {'sid': product.sid, 'enabled': !(product.enabled && !product.preview)},
        url: '/sys/product/enable'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.productQuery()
          console.log('上下架成功')
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('上下架失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    productEdit (product) { // 获取商品详情
      this.axios({
        method: 'get',
        params: {'sid': product.sid},
        url: '/sys/product/get'
//      url: 'http://localhost:7080/static/product.json'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.productVo = data.result
          this.productMod = true // 打开产品编辑/新增模板
          console.log('~~~~~' + this.productVo + '' + this.productMod)
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
    create () { // 新增
      this.productMod = true
      this.productVo = {
        'enabled': true
      }
    },
    selectAll () {
      this.isSelect = !this.isSelect
      this.categorys = []
      if (this.isSelect) {
        for (var i = 0; i < this.categoryList.length; i++) {
          this.categorys.push(this.categoryList[i])
        }
      }
    },
    categorysChange () { // 在分类里显示已选分类
      this.categorysName = ''
      for (let key in this.categorys) {
        this.categorysName += this.categorys[key].name + '、 '
      }
    },
    clickTr (i) {
      this.activeIndex = i
    },
    cancel () {
      this.productMod = false
      this.productQuery()
    },
    changePage (pageNo, pageSize) { // 切换页面
      console.log(pageNo)
      this.currentPage = pageNo
      this.pageSize = pageSize
      this.productQuery()
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
</style>