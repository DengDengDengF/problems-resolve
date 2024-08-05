<template>
  <div class="same">
    <p>同域下cookie单点登录</p>
    <page1/>
    <br/>
    <page2/>
  </div>

  <div class="same">
    <p>不同域下的单点登录 - SSO认证中心</p>
    直接看我封装的把！
  </div>
</template>

<script>
//cookie跨域测试
import {createCookies} from "../../utils/sso/sso-cookie.js";
import  "../../utils/sso/sso-center.js";
//这里引入两个页面测试
import page1 from "../../components/cookieorigin/page1.vue";
import page2 from "../../components/cookieorigin/page2.vue";

export default {
  name: "SingleSignOn",
  components: {page1, page2},
  setup(props, context) {
    createCookies();
  }
}
</script>

<style scoped lang="less">
.same {
  width: 35%;
  height: 164px;
  border: 1px solid red;
  margin: 10px;
}
</style>