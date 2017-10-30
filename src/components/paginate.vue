<template>
  <div v-if="count !== 0" class="page">
    <p v-if="currentPage !== 1" @click="changePage(1)">首页</p>
    <abbr v-if="currentPage !== 1" @click="changePage(currentPage - 1)">{{ pageVo.prevText }}</abbr>
    <div>
      <ul>
      	<li v-if="page.show" v-for="page in pages">
      	  <a v-text="page.number" @click="changePage(page.number)" :class="{ active: page.number === currentPage }"></a>
      	</li>
      </ul>
    </div>
    <abbr v-if="currentPage !== count" @click="changePage(currentPage + 1)">{{ pageVo.nextText }}</abbr>
    <p v-if="currentPage !== count" @click="changePage(count)">末页</p>
    <div style="margin: 0 10px 0 20px;">
    	<span>到第</span>
    	<input type="text" name="pageNo" v-model="pageNo" />
    	<span>页</span>
    </div>
    <div>
      <span>每页</span>
      <select v-model="pageSize">
		    <option v-for="pageSize in pageSizeList" :value="pageSize">{{ pageSize }}</option>
      </select>
      <span>共/</span>
      <span>{{ totalRecs + '条' }}</span>
    </div>
    <div class="btn-sm" style="border: 1px solid #ccc;" @click="changePage(pageNo)">确定</div>
  </div>
</template>

<script>
export default {
  name: 'paginate',
  data () {
    return {
      pages: [],
      pageSize: 10,
      pageSizeList: [10, 20, 30, 40, 50],
      pageNo: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.pagesInit()
    })
  },
  watch: {
    currentPage: {
      handler: 'pagesInit',
      deep: true
    },
    count: {
      handler: 'pagesInit'
    },
    pageSize: {
      handler: function () {
        this.$emit('changePage', this.currentPage, this.pageSize)
      }
    }
  },
  props: ['pageVo', 'currentPage', 'count', 'totalRecs'],
  methods: {
    pagesInit () {
      this.pages = []
      console.log('页码变化，当前页数：' + this.currentPage + '总页数：' + this.count)
      let page = {}
      for (var i = 1; i <= this.count; i++) {
        if (this.currentPage < 7) { // 前十页的控件按钮显示
          if (i < 11) {
            page = {
              show: true,
              number: i
            }
          } else {
            page = {
              show: false,
              number: i
            }
          }
        } else if (this.count - this.currentPage < 5) {
          if (this.count - i < 10) { // 最后10页的控件按钮显示
            page = {
              show: true,
              number: i
            }
          } else {
            page = {
              show: false,
              number: i
            }
          }
        } else {
          if ((i - this.currentPage > -6) && (i - this.currentPage < 5)) { // 当前页前5页和它的后4页的控件按钮显示
            page = {
              show: true,
              number: i
            }
          } else {
            page = {
              show: false,
              number: i
            }
          }
        }
        this.pages.push(page)
      }
    },
    /**
     * 四个页面切换按钮
     */
    changePage (i) {
      this.$emit('changePage', i || this.currentPage, this.pageSize)
    }
  }
}
</script>

<style scoped>
p,abbr{
  display: inline-block;
  padding: 0 5px;
  height: 25px;
  line-height: 25px;
  cursor: pointer;
}
.page{
  text-align: center;
}
p{
	border: 1px solid #ccc;
}
div{
	display: inline-block;
}
input{
	width: 50px;
	height: 23px;
	line-height: 25px;
	border: 1px solid #ccc;
	padding-left: 8px;
}
a{
	display: inline-block;
	width: 25px;
	height: 25px;
	line-height: 25px;
	color: #2e6da4;
	cursor: pointer;
	border: 1px solid #ccc;
}
li{
	margin: 0 5px;
}
.active{
	background-color: #2e6da4;
	color: #fff;
}
.btn-sm{
  height: 25px;
  font-size: 16px;
}
select{
  height: 27px;
  position: relative;
  top: -1.5px;
}
</style>