<template>
  <div>
    <form id='login-form' action="" method="post">
      <div>
        <label for="account"><span>手机号</span></label>
        <input type="number" id="account" name="account">
      </div>
      <div>
        <label for="password"><span>密码</span></label>
        <input type="password" id="password" name="password">
      </div>
      <button id='login'>登录</button>
    </form>
  </div>
</template>


<script>
import {onMounted} from "vue";
import {strategies} from "../../utils/strategies.js";

export default {
  name: "StrategyLogin",
  setup(props) {
    onMounted(() => {
      var loginForm = document.getElementById('login-form');

      loginForm.onsubmit = function (e) {
        e.preventDefault();
        var account = document.getElementById("account").value;
        var pwd = document.getElementById("password").value;
        var accountIsMobile = strategies.isMobile(account, '手机号格式错误');
        var pwdMinLength = strategies.minLength(pwd, 8, '密码不能小于8位');
        var errorMsg = accountIsMobile || pwdMinLength;
        if (errorMsg) {
          alert(errorMsg);
          return false;
        }
        // ajax 发送请求
      }
    })
  }
}
</script>


<style scoped lang="less">
form {
  width: 236px;
  font-family: 'fantasy';

  span {
    display: inline-block;
    width: 54px;
    text-align: right;
    padding-right: 2px
  }

  input {
    width: 172px;
    border-radius: 20px;
    border-color: cadetblue;
    //'&#account' which means input element with the ID account
    &#account {
      &:hover {
        border-color: cornflowerblue;
      }
    }

    &#password {
      &:hover {
        border-color: cornflowerblue;
      }
    }
  }

  button {
    width: 100%;
    margin-top: 2px;
  }
}

</style>
