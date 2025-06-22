<template>
  <div style="display: flex;">
    <TransitionGroup name="list"
                     tag="div"
                     class="container"
                     v-for="(inner,index) in drag"
    >
      <div
          class="item"
          v-for="(item, i) in inner"
          :key="item.id"
          draggable="true"
          @dragstart="dragstart($event, i,index)"
          @dragenter="dragenter($event, i,index)"
          @dragend="dragend"
          @dragover="dragover"
          @mousedown="mousedown($event)"
          @mouseup="mouseup($event)"
      >
        {{ item.name }}
      </div>
    </TransitionGroup>
  </div>
</template>


<script>
import {reactive} from "vue";

export default {
  name: "DragSort",
  setup(props) {
    const drag = reactive({
      list: [
        {name: 'a', id: 1},
        {name: 'b', id: 2},
        {name: 'c', id: 3},
        {name: 'd', id: 4},
        {name: 'e', id: 5},
      ],
      list1: [
        {name: 'f', id: 6},
        {name: 'g', id: 7},
        {name: 'h', id: 8},
        {name: 'i', id: 9},
        {name: 'j', id: 10},
      ]
    })
    let from = null; //拖动元素从哪里来
    let dragIndex = 0;//拖动元素下标
    let dragId = null;//拖动元素id

    /**根据当前拖动记录from,dragIndex,dragId的变化，为进入其他块做准备
     * @param {Object} e
     * @param {String} index
     * @param {String} flag
     * @return {undefined}*/
    function dragstart(e, index, flag) {
      e.stopPropagation();
      if (flag === 'list') {
        from = 'list';
        dragId = drag.list[index].id;
      } else if (flag === 'list1') {
        from = 'list1';
        dragId = drag.list1[index].id;
      }
      dragIndex = index;
      setTimeout(() => {
        e.target.classList.add('moveing')
      }, 0)
    }

    /**从外部滑入 以及 内部的判断
     * @param {Object} e
     * @param {String} index
     * @param {String} flag
     * @return {undefined}*/
    function dragenter(e, index, flag) {
      e.preventDefault()
      if (from === 'list1' && flag === 'list') { //从list1 滑入 list
        const source = drag.list1[dragIndex];
        drag.list1 = drag.list1.filter(item => item.id !== dragId);//删除list1中的拖动id,这里可以做个防抖，
        drag.list.splice(index, 0, source);//list中插入
        from = 'list';
        // 更新节点位置
        dragIndex = index;
      } else if (from === 'list' && flag === 'list1') {// list 滑入 list1
        const source = drag.list[dragIndex];
        drag.list = drag.list.filter(item => item.id !== dragId)
        drag.list1.splice(index, 0, source);
        from = 'list1';
        // 更新节点位置
        dragIndex = index;
      } else if (dragIndex !== index) {//内部判断，不能和当前重合
        if (from === 'list') {
          const source = drag.list[dragIndex];
          drag.list.splice(dragIndex, 1);
          drag.list.splice(index, 0, source);
        }
        if (from === 'list1') {
          const source = drag.list1[dragIndex];
          drag.list1.splice(dragIndex, 1);
          drag.list1.splice(index, 0, source);
        }
        // 更新节点位置
        dragIndex = index
      }
    }

    /**
     * @param {Object} e
     * @return {undefined}
     * */
    function dragover(e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }

    /**
     * @param {Object} e
     * @return {undefined}
     * */
    function dragend(e) {
      e.target.classList.remove('moveing')
      e.target.classList.remove('pass')
    }

    /**
     * @param {Object} e
     * @return {undefined}
     * */
    function mousedown(e) {
      e.target.classList.add('pass')
    }

    /**
     * @param {Object} e
     * @return {undefined}
     * */
    function mouseup(e) {
      e.target.classList.remove('pass')
    }

    return {
      drag, dragstart, dragenter, dragover, dragend, mousedown, mouseup,
    }
  }
}
</script>


<style scoped lang="less">
.item {
  width: 200px;
  height: 40px;
  line-height: 40px;
  // background-color: #f5f6f8;
  background-color: skyblue;
  text-align: center;
  margin: 10px;
  color: #fff;
  font-size: 18px;
}

.container {
  position: relative;
  padding: 0;
}

.pass {
  background-color: #BEEDC7;
}

.moveing {
  opacity: 0;
}
</style>
