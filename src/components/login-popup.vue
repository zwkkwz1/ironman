<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div v-drag class="popup" style="top: 100px;left: 37%;">
  	<login @loginSuccess='loginSuccess' popup='true'></login>
  </div>
</div>
</template>

<script>
import login from '@/components/login'
export default { // login弹窗组件，（调用了login组件做的弹窗）
  components: {
    login
  },
  methods: {
    loginSuccess (result) { // 接收并转发登入信息
      this.$emit('loginSuccess', result) // 将登入信息传入非App.vue的父组件内，等待父组件将信息转发给App.vue
      console.log('进入login_popup')
    }
  }
}
</script>

<style scoped>
.popup{
  height: 50%;
  width: 500px;
  min-height: 400px;
  display: inline-block;
  z-index: 111111;
  background: #FFFFFF;
}
.login{
  display: inline-block;
  z-index: 11111;
  background: #fff;
  height: 400px;
  width: 500px;
  padding-bottom: 30px;
}
</style>