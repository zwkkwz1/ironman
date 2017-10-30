<script>
const consultType = 1
const categoryType = 2
const productType = 3
const orderType = 4
const stateList = [{
  'code': 1,
  'name': '待确认'
}, {
  'code': 2,
  'name': '已确认'
}, {
  'code': 3,
  'name': '配货中'
}, {
  'code': 4,
  'name': '已发货'
}, {
  'code': 5,
  'name': '已收货'
}, {
  'code': 12,
  'name': '已拒收'
}, {
  'code': 11,
  'name': '未收到货'
}, {
  'code': 13,
  'name': '换货中'
}, {
  'code': 14,
  'name': '退货中'
}, {
  'code': 21,
  'name': '已完成'
}, {
  'code': 22,
  'name': '已取消'
}]
const typeList = [{
  'value': 1,
  'name': '文章'
}, {
  'value': 2,
  'name': '活动'
}]
const ruleTypeList = [{
  'value': 1,
  'name': '佩戴获取积分规则'
}, {
  'value': 2,
  'name': '签到获取积分规则'
}]
const pointsOrExperienceReasonList = [{
  'value': 1,
  'name': '佩戴所得'
}, {
  'value': 2,
  'name': '奖励所得'
}, {
  'value': 3,
  'name': '签到获得'
}, {
  'value': 4,
  'name': '兑换商品'
}]
import axios from 'axios'
export default { // 存放公共方法
  consultType,
  categoryType,
  productType,
  orderType,
  stateList,
  typeList,
  ruleTypeList,
  pointsOrExperienceReasonList,
  name: 'config',
  components: {
    axios
  },
  gotoLogin () { // 回退到登入页面
//  console.log(axios)
    axios.defaults.headers.post['accessToken'] = ''
    axios.defaults.headers.get['accessToken'] = ''
  },
  getCookie (name) { // 读取cookie，返回cookie的值
    let arr = new RegExp('(^| )' + name + '=([^;]*)(;|$)') // 正则匹配
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (document.cookie.match(reg)) {
      arr = document.cookie.match(reg)
      console.log(unescape(arr[2]) + '1')
      return unescape(arr[2])
    } else {
      console.log('没有找到cookie')
      return '' // 不能返回 null， null是object, undefind是字符串。
    }
  },
  delCookie (name) { // 删除cookie
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cval = this.getCookie(name)
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    }
  },
  getStorage (name) {
    let storage = localStorage.getItem(name)
    console.log('没有转化之前取得storage:' + storage)
    storage = JSON.parse(storage)
    console.log('没有转化之后取得storage:' + storage)
    return storage
  },
  dateToString (dateTime, format) { // 时间格式化
    var d, k, o
    o = {
      'M+': dateTime.getMonth() + 1,
      'd+': dateTime.getDate(),
      'h+': dateTime.getHours(),
      'm+': dateTime.getMinutes(),
      's+': dateTime.getSeconds(),
      'q+': Math.floor((dateTime.getMonth() + 3) / 3),
      'S': dateTime.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (dateTime.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (k in o) {
      d = o[k]
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? d : ('00' + d).substr(('' + d).length))
      }
    }
    return format
  }
}
</script>