<template>
  <div class="formWrap">
    <el-form ref="formRef" :model="form" label-position="top" label-width="80px">
      <template v-for="(item, index) in formHeader">
        <!--         当类型为普通文本输入框时 -->
        <el-form-item
            v-if="item.itemType == 'text'"
            :key="index"
            :label="item.labelName"
            :prop="item.propName"
            :rules="
                    item.isRequired
                      ? [
                          {
                            required: true, // 是否必填 是
                            trigger: 'blur', // 触发方式，失去焦点
                            itemType: 'text', // 当前类型，文字输入框
                            labelName: item.labelName, // 当前输入框的名字
                            value: form[item.propName], // 输入框输入的绑定的值
                            validator: validateEveryData, // 校验规则函数
                          },
                        ]
                      : []
                  "
        >

          <el-input
              :placeholder="item.placeholder"
              v-model.trim="form[item.propName]"
              clearable
              size="small"
          ></el-input>
        </el-form-item>
        <!--         当类型为数字类型输入框时 -->
        <el-form-item
            v-if="item.itemType == 'number'"
            :key="index"
            :label="item.labelName"
            :prop="item.propName"
            :rules="
                    item.isRequired
                      ? [
                          {
                            required: true, // 是否必填 是
                            trigger: 'blur', // 触发方式，失去焦点
                            itemType: 'number', // 当前类型，文字输入框
                            labelName: item.labelName, // 当前输入框的名字
                            value: form[item.propName], // 输入框输入的绑定的值
                            validator: validateEveryData, // 校验规则函数
                          },
                        ]
                      : []
                  "
        >
          <el-input
              :placeholder="item.placeholder"
              v-model.trim="form[item.propName]"
              @change="checkInput(item)"
              clearable
              size="small"
          >
            <span slot="suffix">{{ item.unit }}</span>
          </el-input>
        </el-form-item>
        <!-- 当类型为文本域输入框时 -->
        <el-form-item
            v-if="item.itemType == 'textarea'"
            :key="index"
            :label="item.labelName"
            :prop="item.propName"
            :rules="
                    item.isRequired
                      ? [
                          {
                            required: true, // 是否必填 是
                            trigger: 'blur', // 触发方式，失去焦点
                            itemType: 'textarea', // 当前类型，文本域输入框
                            labelName: item.labelName, // 当前输入框的名字
                            value: form[item.propName], // 输入框输入的绑定的值
                            validator: validateEveryData, // 校验规则函数
                          },
                        ]
                      : []
                  "
        >
          <el-input
              type="textarea"
              :placeholder="item.placeholder"
              v-model.trim="form[item.propName]"
              clearable
              size="small"
          ></el-input>
        </el-form-item>
        <!-- 当类型为下拉框一时，固定下拉选项 -->
        <el-form-item
            v-if="item.itemType == 'selectOne'"
            :key="index"
            :label="item.labelName"
            :prop="item.propName"
            :rules="
                    item.isRequired
                      ? [
                          {
                            required: true, // 是否必填 是
                            trigger: '', // blur 或 change 这里就不指定触发方式了，保存提交时再校验
                            itemType: 'selectOne', // 当前类型，固定下拉框类型
                            labelName: item.labelName, // 当前输入框的名字
                            value: form[item.propName], // 输入框输入的绑定的值
                            validator: validateEveryData, // 校验规则函数
                          },
                        ]
                      : []
                  "
        >
          <el-select
              v-model="form[item.propName]"
              :placeholder="item.placeholder"
              clearable
              size="small"
          >
            <el-option
                v-for="(ite, ind) in item.optionsArr"
                :key="ind"
                :label="ite.label"
                :value="ite.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 当类型为下拉框二时，属于枚举值（单选）下拉框，需要根据枚举id发请求获取枚举值 -->
        <el-form-item
            v-if="item.itemType == 'selectTwo'"
            :key="index"
            :label="item.labelName"
            :prop="item.propName"
            :rules="
                    item.isRequired
                      ? [
                          {
                            required: true, // 是否必填 是
                            trigger: '', // blur 或 change 这里就不指定触发方式了，保存提交时再校验
                            itemType: 'selectTwo', // 当前类型，枚举值单选
                            labelName: item.labelName, // 当前输入框的名字
                            value: form[item.propName], // 输入框输入的绑定的值
                            validator: validateEveryData, // 校验规则函数
                          },
                        ]
                      : []
                  "
        >
          <el-select
              v-model="form[item.propName]"
              :placeholder="item.placeholder"
              clearable
              @visible-change="
                      (flag) => {
                        getOptionsArr(flag, item);
                      }
                    "
              :loading="loadingSelect"
              size="small"
          >
            <el-option
                v-for="(ite, ind) in selectTwoOptionsObj[item.propName]"
                :key="ind"
                :label="ite.label"
                :value="ite.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 当类型为下拉框三时，属于枚举值（多选）下拉框，需要根据枚举id发请求获取枚举值 -->
        <el-form-item
            v-if="item.itemType == 'selectThree'"
            :key="index"
            :label="item.labelName"
            :prop="item.propName"
            :rules="
                    item.isRequired
                      ? [
                          {
                            required: true, // 是否必填 是
                            trigger: 'blur', // 这里用blur，防止初次默认校验触发
                            itemType: 'selectThree', // 当前类型，枚举值多选
                            labelName: item.labelName, // 当前输入框的名字
                            value: form[item.propName], // 输入框输入的绑定的值
                            validator: validateEveryData, // 校验规则函数
                            type: 'number',
                          },
                        ]
                      : []
                  "
        >
          <el-select
              v-model="form[item.propName]"
              :placeholder="item.placeholder"
              clearable
              @visible-change="
                      (flag) => {
                        getOptionsArr(flag, item);
                      }
                    "
              :loading="loadingSelect"
              multiple
              collapse-tags
              size="small"
          >
            <el-option
                v-for="(ite, ind) in selectTwoOptionsObj[item.propName]"
                :key="ind"
                :label="ite.label"
                :value="ite.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--                 当类型为日期范围 -->
        <el-form-item
            v-if="item.itemType == 'dateRange'"
            :key="index"
            :label="item.labelName"
            :prop="item.propName"
            :rules="
                    item.isRequired
                      ? [
                          {
                            required: true, // 是否必填 是
                            trigger: '',
                            itemType: 'dateRange', // 当前类型，枚举值多选
                            labelName: item.labelName, // 当前输入框的名字
                            value: form[item.propName], // 输入框输入的绑定的值
                            validator: validateEveryData, // 校验规则函数
                          },
                        ]
                      : []
                  "
        >
          <el-date-picker
              v-model="form[item.propName]"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              clearable
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
          >
          </el-date-picker>
        </el-form-item>
      </template>
    </el-form>
    <!-- 提交表单和重置表单部分 -->
    <div class="btns">
      <el-button type="primary" @click="submitForm" size="small"
      >保存
      </el-button
      >
      <el-button @click="resetForm" size="small">重置</el-button>
    </div>
  </div>
</template>


<script>
import {ref, getCurrentInstance} from "vue";

export default {
  name: "myForm",
  props: {
    // 父组件传递过来,需要渲染的表单
    formHeader: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, {emit}) {
    const {proxy} = getCurrentInstance();
    // console.log(props.formHeader);
    //校验规则，不满足抛出错误
    var validateEveryData = (rule, value, callback) => {
      //   console.log("callback", callback);
      //   console.log("校验某一项的规则对象", rule);
      //   console.log("用户输入的值", value);
      // 对输入框类型的校验,如果通过了
      if (value) {
        if ((value + "").length > 0) {
          // 用于回显时候的校验，因为输入的时候是字符串类型的数字，但是回显的时候可能就是数字
          callback(); // cb函数告知校验结果，必须要加
          return;
        }
      }

      // 对下拉框类型的校验
      if (
          (rule.itemType == "selectOne") |
          (rule.itemType == "selectTwo") |
          (rule.itemType == "selectThree")
      ) {
        if (value) {
          if ((value + "").length > 0) {//下拉框校验通过了
            // 注意枚举值是数字类型的，所以这里要转换成为字符串类型的
            callback();
            return;
          }
        }
      }

      // value=null,rule.itemType!='',以下都是没校验通过的,这里就可以自定义了
      switch (rule.itemType) {
        case "text":
          callback(new Error(rule.labelName + "不能为空")); // 文本类型的规则简单，就是得填写
          break;
        case "number":
          callback(new Error(rule.labelName + "请按规则填写")); // 数字类型的规则比较繁多
          break;
        case "textarea":
          callback(new Error(rule.labelName + "不能为空")); // 文本域类型的规则也简单，就是得填写
          break;
        case "selectOne":
          callback(new Error("请选择" + rule.labelName)); // 下拉框类型一 得填写
          break;
        case "selectTwo":
          callback(new Error("请选择" + rule.labelName)); // 下拉框类型二 得填写
          break;
        case "selectThree":
          callback(new Error("请选择" + rule.labelName)); // 下拉框类型三 多选数组得填写
          break;
        case "dateRange":
          callback(new Error("请选择" + rule.labelName + "范围")); // 下拉框类型三 多选数组得填写
          break;

        default:
          break;
      }
    };
    // 此对象用于存储各个下拉框的数组数据值，其实也可以挂在vue的原型上，
    const selectTwoOptionsObj = ref({});
    // 用于下拉框加载时的效果
    const loadingSelect = ref(false);
    // 绑定的数据
    const form = ref({});
    const formRef = ref(null);

    async function getOptionsArr(flag, item) {
      //   console.log(flag, item);
      // 为true时表示展开，这里模拟根据枚举值id发请求，获取下拉框的值的
      if (flag) {
        loadingSelect.value = true; // 使用了加载中效果，最好加上一个try catch捕获异常
        // let result = await this.$api.getEnumList({id:item.enumerationId})
        getOptionsArrData(item);
      } else {
        // 解决多选下拉框失去焦点校验规则仍然存在问题
        if (item.itemType == "selectThree") {
          //   console.log("关闭时校验多选值", this.form[item.propName]);
          if (form.value[item.propName].length > 0) {
            //  如果至少选择一个了，说明符合要求，就再校验一次，这样校验规则就去掉了
            formRef.value.validateField(item.propName);
          }
        }
      }
    };

    function getOptionsArrData(item) {
      // console.log(item)
      setTimeout(() => {
        loadingSelect.value = false;
        if (item.enumerationId == "123123123") {
          selectTwoOptionsObj.value[item.propName] = [
            {
              label: "医生",
              value: 1,
            },
            {
              label: "教师",
              value: 2,
            },
            {
              label: "公务员",
              value: 3,
            },
          ];
        }
        if (item.enumerationId == "456456456") {
          selectTwoOptionsObj.value[item.propName] = [
            {
              label: "成为百万富翁",
              value: 1,
            },
            {
              label: "长生不老",
              value: 2,
            },
            {
              label: "家人健康幸福平安",
              value: 3,
            },
          ];
        }
        if (item.enumerationId == "789789789") {
          selectTwoOptionsObj.value[item.propName] = [
            {
              label: "乒乓球",
              value: 1,
            },
            {
              label: "羽毛球",
              value: 2,
            },
            {
              label: "篮球",
              value: 3,
            },
          ];
        }
        if (item.enumerationId == "147258369") {
          selectTwoOptionsObj.value[item.propName] = [
            {
              label: "华为",
              value: 1,
            },
            {
              label: "小米",
              value: 2,
            },
            {
              label: "苹果",
              value: 3,
            },
            {
              label: "三星",
              value: 4,
            },
          ];
        }
        proxy.$forceUpdate();// 这里需要强制更新一下，否则渲染不出来下拉框选项
      }, 300);
    }

    // 数字类型加校验规则,change的时候进行校验，校验没有通过，那么value设置为null, 通常和validateEveryData校验函数一起使用
    function checkInput(item) {
      console.log("数字类型的再细分规则，可以根据item.labelName再写判断", item);
      if (item.labelName == "年龄") {
        let reg = /^[1-9]\d*$/;
        if (reg.test(form.value[item.propName] * 1)) {
          // console.log("符合要求，年龄大于0的正整数");
        } else {
          form.value[item.propName] = null;
        }
      }
      if (item.labelName == "工资") {
        let reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/;
        if (reg.test(form.value[item.propName] * 1)) {
          // console.log("符合要求，工资保留两位小数");
          form.value[item.propName] = (form.value[item.propName] * 1).toFixed(2);
        } else {
          form.value[item.propName] = null;
        }
      }
      if ("某个数字类型字段值") {
        // 加对应规则
      }
    }

    // 保存提交表单
    async function submitForm() {
      debugger
      formRef.value.validate((valid) => {
        if (valid) {
          emit("submitForm", form.value);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }

    // 重置表单
    function resetForm() {
      formRef.value.resetFields();
      form.value = {}; // 这里重置完了以后，要重新初始化数据，否则会出现输入不上去的问题
      emit("resetForm");
    }

    return {
      validateEveryData,
      selectTwoOptionsObj,
      loadingSelect,
      form,
      checkInput,
      submitForm,
      resetForm,
      getOptionsArrData,
      getOptionsArr,
      formRef,
    }

  }

}
</script>


<style scoped lang="less">
.formWrap {
  width: 100%;

  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-form-item {
      width: 47%;
      margin-bottom: 12px !important;

      .el-form-item__label {
        padding: 0 !important;
        line-height: 24px !important;
      }

      .el-form-item__content {
        // 给文本域类型定高度
        .el-textarea {
          textarea {
            height: 75px !important;
          }
        }

        // 给下拉框指定宽度百分比
        .el-select {
          width: 100% !important;
        }

        // 时间选择器指定宽度百分比
        .el-date-editor {
          width: 100% !important;

          .el-range-separator {
            width: 10% !important;
          }
        }

        .el-form-item__error {
          padding-top: 1px !important;
        }
      }
    }
  }

  .btns {
    width: 100%;
    text-align: center;
    margin-top: 12px;
  }
}

</style>
