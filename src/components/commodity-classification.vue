<template>
<div>
  <div class="table" style="margin-top: 40px;">
    <div class="btn-md btn-default" style="margin-bottom: 10px;" @click="create">新建</div>
    <div class="err-msg" v-text="errMsg"></div>
		<table style="min-width: 600px;width: 100%;" class="table-hover">
		  <colgroup>
			<col style="width:40px;"/>
			<col />
			<col />
			<col />
			<col />
			<col />
		  </colgroup>
		  <thead>
		    <th style="min-width:40px;max-width: 50px;">序号</th>
		    <th>图 片</th>
		    <th>分类名称</th>
		    <th>排列序号</th>
		    <th>备注</th>
		    <th>操作</th>
		  </thead>
		  <tbody>
	      <tr v-for="(category, index) in categoryList" @click="clickTr(index)" :class="{tableActive: activeIndex === index}">
		      <td>
	          <div v-text="index + 1"></div>
	        </td>
	        <td><img width="70" :src="category.image" alt="上海帝仪" style="vertical-align: bottom;"
	        	onerror="javascript:this.src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496385415687&di=cfb8c3b6a69be436172b2fbcf2d35748&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F55%2F73%2F39I58PICCqK_1024.png'"/></td>
	        <td><div style="min-width:100px" v-text="category.name"></div></td>
	        <td><div style="min-width:100px" v-text="category.sortNum"></div></td>
	        <td><div style="min-width:100px" v-text="category.memo"></div></td>
	        <td>
	          <div class="btn-sm btn-default btn-left" @click="productCategoryEdit(category)">编辑</div>
	          <div class="btn-sm btn-default" @click="productCategoryEnable(category)">{{category.enabled ? '下架' : '上架'}}</div>
	        </td>
	      </tr>
		  </tbody>
		</table>
  </div>
  <div v-if="categoryMod">
  	<category-modal :params='categoryVo' @cancel='getProductCategoryList' @setLoginInfo='setLoginInfo' @loginSuccess='loginSuccess'></category-modal>    
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
import categoryModal from '@/components/category-modal'
export default {
  name: 'commodityClassification',
  data () {
    return {
      categoryList: [],
      errMsg: '',
      loginPopup: false,
      activeIndex: -1,
      categoryMod: false
    }
  },
  components: {
    loginPopup,
    paginate,
    categoryModal
  },
  mounted () {
    this.$nextTick(() => {
      this.getProductCategoryList()
    })
  },
  methods: {
    getProductCategoryList () { // 获取分类列表
      this.categoryMod = false
      this.axios({
        method: 'get',
        url: '/sys/product-category/list'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.categoryList = data.result.list
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          this.errMsg = data.msg
          this.hideMsg()
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    productCategoryEnable (category) { // 商品分类上下架
      this.axios({
        method: 'get',
        params: {'sid': category.sid, 'enabled': !category.enabled},
        url: '/sys/product-category/enable'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.getProductCategoryList()
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          this.errMsg = data.msg
          this.hideMsg()
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    productCategoryEdit (category) { // 编辑
      this.axios({
        method: 'get',
        params: {'sid': category.sid},
        url: '/sys/product-category/get'
      }).then((response) => {
        var data = response.data
        if (data.type === 1) {
          this.categoryVo = data.result
          this.categoryMod = true
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          this.errMsg = data.msg
          this.hideMsg()
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    create () { // 新建
      this.categoryMod = true
      this.categoryVo = {
        'enabled': true
      }
      console.log('新建')
    },
    hideMsg () {
      setTimeout(() => {
        this.errMsg = ''
      }, 5000)
    },
    clickTr (i) {
      this.activeIndex = i
      console.log(this.activeIndex)
    },
    loginSuccess (result) { // 接收登入弹框返回的登入信息并转发给App.vue or 接收从编辑新建弹框传过来的登入信息
      this.$emit('setLoginInfo', result) // 登入成功，显示导航栏
      console.log('弹窗登入成功')
      this.loginPopup = false
    }
  }
}
</script>

<style scoped>
.categoryEnable{
  box-shadow: 2px 2px 2px #1B6D85;
}
</style>