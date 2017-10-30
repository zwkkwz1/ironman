// 注册一个全局自定义指令 v-focus
export default {
  directive: {
    focus: {
      // 指令的定义---
      inserted: function (el) {}
    },
    drag: {
      inserted: function (el) {
        // 聚焦元素
        el.onmousedown = function (ev) {
          var x = ev.pageX - el.offsetLeft
          var y = ev.pageY - el.offsetTop
          document.onmousemove = function (ev) {
            var l = ev.pageX - x
            var t = ev.pageY - y
            el.style.left = l + 'px'
            el.style.top = t + 'px'
          }
          document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  }
}
