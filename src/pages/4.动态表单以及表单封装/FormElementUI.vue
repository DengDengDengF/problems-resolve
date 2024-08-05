<template>
  <div class="myWrap">
    <a href="https://juejin.cn/post/7060322827148197895">链接至文档</a>
    <h2>填写表单</h2>
    <br/>
    <!--
    使用了插槽，只需要传递参数就可以，定制化开发
    子组件保存/重置后的二次操作，可以通过子传递父的方式通知父，去做二次操作
    -->
    <my-form
        ref="myForm"
        :formHeader="formHeader"
        @submitForm="submitForm"
        @resetForm="resetForm"
    ></my-form>
    <h2>表单数据回显</h2>
    <el-button size="small" type="primary" @click="showData"
    >点击按钮回显数据
    </el-button
    >
  </div>
</template>


<script>
//封装后的表单
import MyForm from "../../components/MyForm.vue";
import {reactive, onMounted, ref} from "vue";

export default {
  name: "FormElementUI",
  components: {MyForm},
  setup() {
    //表头数组数据
    const formHeader = reactive([
      /**
       * 输入框类型3种
       *    1. 普通文本输入框 text
       *    2. 数字类型输入框 number
       *    3. 文本域输入框 textarea
       *
       * 下拉框select类型2中
       *    1. 固定配置的el-option selectOne
       *    2. 枚举值的el-option单选 selectTwo
       *    2. 枚举值的el-option多选 selectThree
       *
       * 时间选择器类型1种
       *    1. 两个时间选择器、选取一个范围
       *
       * 等等，还有其他类型，这里举三种类型，别的类型仿照着即可写出来
       * 组件封装适可而止。如果是比较复杂（奇葩）的需要联动的表单，建议一个个写
       * 毕竟过度的封装，会导致代码不好维护（个人愚见）
       * */
      {
        itemType: "text", // 输入框类型
        labelName: "姓名", // 输入框名字
        propName: "name", // 输入框字段名
        isRequired: true, // 是否必填
        placeholder: "请填写名字", // 输入框placeholder提示语加上，可用于告知用户规则
      },
      {
        itemType: "number",
        labelName: "年龄",
        propName: "age",
        isRequired: true,
        unit: "year", // 数字类型的要有单位
        placeholder: "请输入年龄（大于0的正整数）",
      },
      {
        itemType: "number",
        labelName: "工资",
        propName: "salary",
        isRequired: true,
        unit: "元/月", // 数字类型的要有单位
        placeholder: "请输入每月工资金额（大于0且保留两位小数）",
      },
      {
        itemType: "textarea",
        labelName: "备注",
        propName: "remark",
        isRequired: true,
        placeholder: "请填写备注",
      },
      {
        itemType: "selectOne", // 下拉框类型一，固定的选项可以写死在配置里，比如性别只有男女
        labelName: "性别",
        propName: "gender",
        isRequired: true,
        placeholder: "请选择性别",
        optionsArr: [
          {
            label: "男",
            value: 1,
          },
          {
            label: "女",
            value: 2,
          },
        ],
      },
      {
        itemType: "selectTwo", // 下拉框类型二，枚举值单选，在点击下拉选项时根据枚举id发请求，获取枚举值
        labelName: "可选职业",
        propName: "job",
        isRequired: true,
        placeholder: "请选择职业",
        enumerationId: "123123123",
      },
      {
        itemType: "selectTwo", // 下拉框类型二，枚举值单选，在点击下拉选项时根据枚举id发请求，获取枚举值
        labelName: "愿望",
        propName: "wish",
        isRequired: true,
        placeholder: "请选择愿望",
        enumerationId: "456456456",
      },
      {
        itemType: "selectThree", // 下拉框类型三，枚举值多选，在点击下拉选项时根据枚举id发请求，获取枚举值
        labelName: "爱好",
        propName: "hobby",
        isRequired: true,
        placeholder: "请选择爱好",
        enumerationId: "789789789",
      },
      {
        itemType: "selectThree", // 下拉框类型三，枚举值多选，在点击下拉选项时根据枚举id发请求，获取枚举值
        labelName: "想买手机",
        propName: "wantPhone",
        isRequired: true,
        placeholder: "请选择手机",
        enumerationId: "147258369",
      },
      {
        itemType: "dateRange", // 日期范围类型
        labelName: "日期",
        propName: "date",
        isRequired: true,
      },
    ]);
    const myForm = ref(null);


    onMounted(() => {
      // 数据回显的时候，要先发请求获取枚举值下拉框的值才能够正确的回显，所以
      // 就提前发请求获取对应下拉框的值了，这里要注意！注意！注意！
      formHeader.forEach((item) => {
        if ((item.itemType == "selectTwo") || (item.itemType == "selectThree")) {
          myForm.value.getOptionsArrData(item);
        }
      });
    })
    //数据回显
    const showData = () => {
      let apiData = {
        name: "孙悟空",
        age: 500,
        salary: 6666.66,
        remark: "齐天大圣是也",
        gender: 1, // 1代表男
        job: 1, // 1医生 2教师 3公务员
        wish: 3, // 1成为百万富翁 2长生不老 3家人健康幸福平安
        hobby: [1, 2, 3], // 1乒乓球 2羽毛球 3篮球
        wantPhone: [1, 2, 4], // 1华为 2小米 3苹果 4三星
        date: ["2018-06-06", "2022-05-05"],
      };
      setTimeout(() => {
        myForm.value.form = apiData;
      }, 300);
    }
    //提交
    const submitForm = (form) => {
      console.log('表单提交', form)
    }
    //重置
    const resetForm = () => {
      console.log('表单重置')
    }

    return {
      formHeader,
      myForm,
      submitForm,
      resetForm,
      showData,

    }

  }
}
</script>


<style scoped lang="scss">
.myWrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 25px;
  overflow-y: auto;
}
</style>
