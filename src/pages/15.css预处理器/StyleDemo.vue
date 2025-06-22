<template>
  <div>
    <div id="var"><span>变量</span></div>
    <div id="test">test</div>
    <div id="module">module</div>
  </div>
</template>


<script>
export default {
  name: "StyleDemo"
}
</script>


<style scoped lang="less">
@import "src/assets/modules/mixns.less";
@import "src/assets/modules/variables.less";

//导入
//@import '';
// 变量使用
@width: 100px;
@height: 100px;
@color: red;
@span-border: orange;
@top: 0px;
//计算
@distance: 90px * 3;
//混入(Mixin)
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

//函数
.marginTop(@a,@b) {
  @top: @a + @b;
}

#var {
  //变量
  width: @width;
  height: @height;
  border: 1px solid @color;
  //计算
  margin-left: @distance;
  //函数
  .marginTop(100px, 100px);
  margin-top: @top;
  //混入(Mixin)
  .flex();
  //嵌套
  span {
    border: 1px solid @span-border;
  }
}

//动态css
.calcWidth() {
  height: calc(100vh - 50vh);
}

#test {
  .calcWidth();
  width: @width;
  border: 1px solid red;
}

//使用module
#module {
  color: @primary-color;
  font-size: @font-size;
  .border-radius(10px);
  border: solid black;
}

/**
!重要注释，压缩模式也会保留
*/
</style>
