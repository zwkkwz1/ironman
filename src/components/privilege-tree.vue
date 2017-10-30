<template>
<div>
  <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 1040;"></div>
  <div class="popup" style="left: 30%;top: 140px;width: 700px;font-size: 16px;height: 500px;overflow-x: hidden;overflow-y: auto;">
	  <div class="head" style="text-align: center;width: 700px;">
	    <p style="font-weight: bold;"></p>
		  <i class="icon-remove icon-white" @click="cancel()"></i>			  	
	  </div>
    <legend>
  	  <title style="width: 100%;">权限选择</title>
  	</legend>
	  <ul>
	  	<li v-for="(privilege, index) in privilegeTree">
	  	  <input type="checkbox" v-model="privilege.isChecked" @click="lel1Click(privilege)" />
	  	  <p v-text="privilege.dispName"></p>
	  	  <ul v-if="privilege.children">
	  	  	<li v-for="(privilege2, index) in privilege.children">
	  	      <input type="checkbox" v-model="privilege2.isChecked" @click="lel2Click(privilege2)" />
	  	      <p v-text="privilege2.dispName"></p>
	  	      <ul v-if="privilege2.children">
	  	        <li v-for="(privilege3, index) in privilege2.children">
	  	          <input type="checkbox" v-model="privilege3.isChecked" />
	  	          <p v-text="privilege3.dispName"></p>
	  	        </li>
	  	      </ul>
	  	    </li>
	  	  </ul>
	  	</li>
	  </ul>
	  <div style="text-align: center;top: 580px;height: 40px;width: 690px;">
  	  <div class="btn-md btn-default btn-table btn-left" @click="submit">提 交</div>
  	  <div class="btn-md btn-default btn-table" @click="cancel">取 消</div>
  	  <p class="err-msg" style="position: absolute;" v-text="errMsg"></p>
  	</div>
	  <div v-if="loginPopup">
	    <login-popup @loginSuccess='loginSuccess'></login-popup>
	  </div>
  </div>
</div>
</template>

<script>
import config from '@/components/config'
import loginPopup from '@/components/login-popup'
export default { // 产品新增，编辑弹框
  name: 'privilege-modal',
  data () {
    return {
      errMsg: '',
      privilegeVo: {},
      loginPopup: false
    }
  },
  props: ['groupSid', 'privilegeTree', 'privilegeList'],
  mounted () {
    this.$nextTick(() => {
      this.givePrivilege()
    })
  },
  components: {
    loginPopup
  },
  methods: {
    submit () { // 提交
      this.privilegeVo = {
        'groupSid': this.groupSid,
        'privilegeSids': []
      }
      for (let key in this.privilegeTree) {
        if (this.privilegeTree[key].isChecked) {
          this.privilegeVo.privilegeSids.push(this.privilegeTree[key].sid)
          for (let key2 in this.privilegeTree[key].children) {
            if (this.privilegeTree[key].children[key2].isChecked) {
              this.privilegeVo.privilegeSids.push(this.privilegeTree[key].children[key2].sid)
            }
          }
        } else {
          continue
        }
      }
      this.axios({
        method: 'post',
        url: '/sys/rbac/group/add-privilege',
        data: this.privilegeVo
      }).then((response) => {
        let data = response.data
        if (data.type === 1) {
          console.log('跟新成功')
          this.cancel()
        } else if (data.type === 401) { // 登入信息验证失败
          config.gotoLogin()
          this.loginPopup = true
        } else {
          this.errMsg = '积分规则跟新失败'
          this.hideMsg()
        }
      }).catch((error) => {
        console.log('error信息是：' + error)
      })
    },
    givePrivilege () {
      let sids = []
      for (let key in this.privilegeList) {
        sids.push(this.privilegeList[key].privilegeSid)
      }
      for (let i in this.privilegeTree) {
        if (sids.indexOf(this.privilegeTree[i].sid) > -1) { // 这个权限已选择
          this.privilegeTree[i].isChecked = true
          for (let key2 in this.privilegeTree[i].children) {
            if (sids.indexOf(this.privilegeTree[i].children[key2].sid) > -1) {
              this.privilegeTree[i].children[key2].isChecked = true
              for (let key3 in this.privilegeTree[i].children[key2].children) {
                if (sids.indexOf(this.privilegeTree[i].children[key2].children[key3].sid) > -1) {
                  this.privilegeTree[i].children[key2].children[key3].isChecked = false
                }
              }
            } else {
              this.privilegeTree[i].children[key2].isChecked = false
              continue
            }
          }
        } else {
          this.privilegeTree[i].isChecked = false
          continue
        }
      }
      this.$set(this.privilegeTree)
    },
    lel1Click (privilege) {
      if (!privilege.isChecked) {
        for (let key in privilege.children) {
          privilege.children[key].isChecked = false
          for (let key2 in privilege.children[key].children) {
            privilege.children[key].children[key2].isChecked = false
          }
        }
      }
      this.$set(privilege.children)
    },
    lel2Click (privilege) {
      if (!privilege.isChecked) {
        for (let key in privilege.children) {
          privilege.children[key].isChecked = false
        }
      }
      this.$set(privilege.children)
    },
    hideMsg () {
      setTimeout(() => {
        this.errMsg = ''
        this.uploadMsg = ''
      }, 5000)
    },
    cancel () { // 关闭弹框
      this.$emit('cancel')
    },
    loginSuccess (result) {
      this.$emit('loginSuccess', result)
      console.log('弹窗登入成功')
      this.loginPopup = false
    }
  }
}
</script>

<style scoped>
p{
  display: inline-block;
  margin: 0;
}
input[type='checkbox']{
  margin: 0;
  vertical-align: bottom;
}
li{
  margin-left: 20px;
  display: block;
}
</style>