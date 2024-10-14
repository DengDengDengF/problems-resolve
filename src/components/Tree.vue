<template>
  <div>
    <div v-for="item in data" :key="item.id">
      <div class="flex">
        <a v-if='item.children' :class="item.open?'transicon':''" @click="open(item)"></a>
        <button @click="select(item)" :class="item.select=='1'?'active':item.select=='2'?'actives':''"></button>
        <div>{{ item.label }}</div>
      </div>
      <div class="children" v-show="item.children && item.open">
        <Tree :data='item.children'/>
      </div>
    </div>
  </div>
</template>

<script>

import {defineComponent, getCurrentInstance} from 'vue';

export default defineComponent({
  name: 'Tree',
  props: {
    data: {
      type: Array,
    }
  },
  setup(props) {
    const instance = getCurrentInstance();

    const select = (item) => {
      //==1是全选了显示对号 ==2是没全选显示横岗 剩下的就是没选的状态
      if (item.select === '1' || item.select === '2') {
        item.select = '0';
      } else {
        item.select = '1';
      }
      forLiat(item);//这个是你点击了的框的孩子们要做的事
      parentList(instance.proxy.$parent);//这是他的祖宗们要做的
    };

    const parentList = (item) => {
      if (!item.data) return;//parent 以及 parent兄弟 的集合
      for (let i = 0; i < item.data.length; i++) {
        let children = item.data[i].children;//parent的每一个children
        let a = 0;//选中
        let b = 0;
        if (children) {
          for (let j = 0; j < children.length; j++) {
            let ele = children[j];
            if (ele.select === '1') a++; //选中 a++
            if (ele.select !== '1' && ele.select !== '2') b++;//未选中 b++;
          }
          let ele = item.data[i];//当前parent
          //根据当前parent的length 和  选中/未选中 数据对比赋值
          if (ele.children.length === a) {
            ele.select = '1';
          } else if (ele.children.length === b) {
            ele.select = '0';
          } else {
            ele.select = '2';
          }
        }
      }
      parentList(item.$parent);
    };

    const forLiat = (item) => {//item的子元素继承父元素的选中状态
      if (item.children) {
        item.children.forEach((element) => {
          element.select = item.select;
          if (element.children) {
            forLiat(element);//反复循环直到没子元素了
          }
        });
      }
    };

    const open = (item) => {
      item.open = !item.open;
    };

    return {
      select,
      parentList,
      forLiat,
      open
    };
  }
});
</script>


<style scoped lang="css">
.children {
  padding-left: 15px;
}

.childrenhide {
  display: none;
}

.flex {
  display: flex;
  align-items: center;
  padding-left: 20px;
  position: relative;
  margin: 5px 0;
}

.flex > a {
  position: absolute;
  left: 0px;
  width: 0;
  height: 0;
  border-left: 6px solid black;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  margin-left: 10px;
  margin-right: 10px;
  transform: rotate(0deg);
  transition: transform 0.3s ease-in-out;
}

.transicon {
  transform: rotate(90deg) !important;
}

button {
  margin: 0 5px;
  outline: 0;
  line-height: 1;
  display: inline-block;
  position: relative;
  border: 2px solid #212121;
  border-radius: 2px;
  width: 16px;
  height: 16px;
  background-color: #fff;
  z-index: 1;
  -webkit-transition: border-color 0.15s ease-in, background-color 0.15s ease-in;
  transition: border-color 0.15s ease-in, background-color 0.15s ease-in;
}

/* 对号 */
.active {
  background-color: #2196f3;
  border-color: #2196f3;
}

.active::after {
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  content: '';
  border: 2px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 6px;
  left: 4px;
  position: absolute;
  top: 1px;
  width: 3px;
  -webkit-transition: -webkit-transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
  transition: -webkit-transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
  transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
  transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s,
  -webkit-transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: rotate(45deg) scaleY(1);
  transform: rotate(45deg) scaleY(1);
}

/* 横杠 */
.actives {
  background-color: #2196f3;
  border-color: #2196f3;
}

.actives::before {
  content: '';
  position: absolute;
  display: block;
  border-top: 2px solid #fff;
  left: 3px;
  right: 3px;
  top: 50%;
  -webkit-transform: translateY(-1px);
  transform: translateY(-1px);
}

</style>
