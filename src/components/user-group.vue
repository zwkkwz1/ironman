<template>
<div>
  <div class="table" style="margin-top: 50px;">
    <table style="min-width: 600px;width: 100%;" class="table-hover">
      <colgroup>
        <col />
        <col />
      </colgroup>
      <thead>
        <th>用户组</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="(group, index) in groupList">
          <td><div v-text="group"></div></td>
          <td><div class="btn-md btn-default" @click="getPrivilegeTree(group)">权限编辑</div></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="privilegeModShow">
    <privilege-tree :privilegeTree='privilegeTree' :privilegeList='privilegeList' :groupSid='groupVo' @cancel='cancel' ></privilege-tree>
  </div>
  <div v-if="loginPopup">
  	<login-popup @loginSuccess='loginSuccess'></login-popup>
  </div>
</div>
</template>

<script>
import config from '@/components/config'
import loginPopup from '@/components/login-popup'
import privilegeTree from '@/components/privilege-tree'
export default {
  name: 'userGroup',
  data () {
    return {
      loginPopup: false,
      groupList: [],
      privilegeTree: [],
      privilegeList: [],
      privilegeModShow: false,
      groupVo: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getUseGroupList()
    })
  },
  components: {
    loginPopup,
    privilegeTree
  },
  methods: {
    getUseGroupList () { // 获取用户组列表
      this.axios({
        method: 'get',
        url: '/sys/rbac/group/list'
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          this.groupList = data.result.list
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('用户组获取失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getPrivilegeTree (group) {
      this.groupVo = group
      this.axios({
        method: 'get',
        url: '/sys/rbac/privilege/tree'
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          this.privilegeTree = data.result.list
          this.getUserGroupPrivileges(group)
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('获取失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getUserGroupPrivileges (group) {
      this.axios({
        method: 'get',
        params: {'groupSid': group},
        url: '/sys/rbac/privilege/get'
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          this.privilegeList = data.result.list
          this.privilegeModShow = true
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          console.log('获取失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    cancel () {
      this.privilegeModShow = false
      this.getUseGroupList()
    },
    loginSuccess (result) { // 登入成功（从弹窗登入成功）
      this.loginPopup = false
      this.$emit('setLoginInfo', result)
      console.log('弹窗登入成功')
    }
  }
}
</script>

<style>
</style>