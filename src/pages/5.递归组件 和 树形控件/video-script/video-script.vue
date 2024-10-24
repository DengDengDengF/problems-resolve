<template>
  <div class="video-script">
    <addFields v-model:addFormVisible="addFormVisible" @add="add" v-if="addFormVisible" />
    <ediFields
      v-model:dialogFormVisible="dialogFormVisible"
      :rowDetail="rowDetail"
      v-if="dialogFormVisible"
      @edit="edit"
    />
    <editTitle
      v-model:dialogFormVisible="dialogFormVisible2"
      :rowDetail="rowDetail2"
      v-if="dialogFormVisible2"
      @edit="edit2"
    />
    <editTemplate
      v-model:dialogFormVisible="dialogFormVisible3"
      :rowDetail="rowDetail3"
      v-if="dialogFormVisible3"
      @edit="edit3"
    />
    <addTemplate v-model:addFormVisible="addFormVisible2" @add="add2" v-if="addFormVisible2" />
    <el-card class="left content">
      <div class="header">
        <div>脚本模板</div>
        <div style="color: #409eff; cursor: pointer" @click="addClick2">新增模板</div>
      </div>
      <div
        class="wd"
        v-for="(item, index) in dataList"
        @click="show(index)"
        :style="{ color: index == heightLight ? '#409EFF' : '' }"
      >
        <div>{{ item.name }}</div>
        <div class="wd_r" @click.stop>
          <el-switch
            v-model="item.status"
            :active-value="1"
            :inactive-value="0"
            @click="switchClick"
          />
          <el-icon @click="editClick3(index)">
            <Edit />
          </el-icon>
          <el-icon @click="delClick2(index)">
            <Delete />
          </el-icon>
        </div>
      </div>
    </el-card>
    <el-card class="right content">
      <div class="core_else" v-for="(item, index) in currentList.data.coreUp">
        <div class="core_else_l">
          <div class="title">{{ item.title }}</div>
          <div class="edit" @click="editClick(0, index)">
            <el-icon>
              <Edit />
            </el-icon>
          </div>
        </div>
        <div class="core_else_m">
          <span v-if="item.type == 0">单选</span>
          <span v-if="item.type == 1">多选</span>
          <span v-if="item.type == 2">文本</span>
          <span v-if="item.type == 3">图片</span>
          <span v-if="item.type == 4">附件</span>
        </div>
        <div class="core_else_r">
          <el-icon style="cursor: pointer" @click="delClick(0, index)">
            <Delete />
          </el-icon>
          <el-popover placement="bottom" :width="100" trigger="hover">
            <template #reference>
              <el-icon>
                <CirclePlus />
              </el-icon>
            </template>
            <div @click="addClick(0, 0, index)" style="padding: 10px; cursor: pointer">
              在上方插入一行
            </div>
            <div @click="addClick(0, 1, index)" style="padding: 10px; cursor: pointer">
              在下方插入一行
            </div>
          </el-popover>
        </div>
      </div>
      <div class="core">
        <div class="core_left" style="">
          <div class="name">{{ currentList.data.coreName }}</div>
          <div class="edit" @click="editClick2(currentList.data.coreName)">
            <el-icon>
              <Edit />
            </el-icon>
          </div>
        </div>
        <div class="core_item" v-for="(item, index) in currentList.data.core">
          <div class="top">
            <div class="top_1">
              <div class="top_1_1">{{ item.title }}</div>
              <div class="top_1_2" @click="editClick(1, index)">
                <el-icon>
                  <Edit />
                </el-icon>
              </div>
            </div>
            <div class="top_2">
              <el-icon
                style="cursor: pointer"
                v-show="currentList.data.core.length > 1"
                @click="delClick(1, index)"
              >
                <Delete />
              </el-icon>
              <el-popover placement="bottom" :width="100" trigger="hover">
                <template #reference>
                  <el-icon>
                    <CirclePlus />
                  </el-icon>
                </template>
                <div @click="addClick(1, 0, index)" style="padding: 10px; cursor: pointer">
                  往左侧插入一列
                </div>
                <div @click="addClick(1, 1, index)" style="padding: 10px; cursor: pointer">
                  往右侧插入一列
                </div>
              </el-popover>
            </div>
          </div>
          <div class="bottom">
            <span v-if="item.type == 0">单选</span>
            <span v-if="item.type == 1">多选</span>
            <span v-if="item.type == 2">文本</span>
            <span v-if="item.type == 3">图片</span>
            <span v-if="item.type == 4">附件</span>
          </div>
        </div>
        <div class="core_option">
          <el-popover placement="bottom" :width="100" trigger="hover">
            <template #reference>
              <el-icon>
                <CirclePlus />
              </el-icon>
            </template>
            <div @click="addClick(2, 0)" style="padding: 10px; cursor: pointer">在上方插入一行</div>
            <div @click="addClick(2, 1)" style="padding: 10px; cursor: pointer">在下方插入一行</div>
          </el-popover>
        </div>
      </div>
      <div class="core_else" v-for="(item, index) in currentList.data.coreDown">
        <div class="core_else_l">
          <div class="title">{{ item.title }}</div>
          <div class="edit" @click="editClick(3, index)">
            <el-icon>
              <Edit />
            </el-icon>
          </div>
        </div>
        <div class="core_else_m">
          <span v-if="item.type == 0">单选</span>
          <span v-if="item.type == 1">多选</span>
          <span v-if="item.type == 2">文本</span>
          <span v-if="item.type == 3">图片</span>
          <span v-if="item.type == 4">附件</span>
        </div>
        <div class="core_else_r">
          <el-icon style="cursor: pointer" @click="delClick(3, index)">
            <Delete />
          </el-icon>
          <el-popover placement="bottom" :width="100" trigger="hover">
            <template #reference>
              <el-icon>
                <CirclePlus />
              </el-icon>
            </template>
            <div @click="addClick(3, 0, index)" style="padding: 10px; cursor: pointer">
              在上方插入一行
            </div>
            <div @click="addClick(3, 1, index)" style="padding: 10px; cursor: pointer">
              在下方插入一行
            </div>
          </el-popover>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script  setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import addFields from './cpn/addFields.vue'
import ediFields from './cpn/editFields.vue'
import editTitle from './cpn/editTitle.vue'
import editTemplate from './cpn/editTemplate.vue'
import addTemplate from './cpn/addTemplate.vue'
import { ElMessage} from 'element-plus'

//当前高亮
const heightLight = ref(0)

//类型列表
let dataList = reactive([
  {
    "name": '超级模板', //模板名字
    "status": 1, //0不可被前台看到  1 可以被前台看到
    "data": {
      "coreUp": [
        {
          "title": 'abcdd', //字段名称
          "type": 4, //单选0  多选1  文本2  图片3  附件4
          "tips": '', //字段提示
          "options": [] //字段选项
        },
        {
          "title": 'fff', //字段名称
          "type": 3, //单选0  多选1  文本2  图片3  附件4
          "tips": '', //字段提示
          "options": [] //字段选项
        }
      ], //核心组件上面的
      "core": [
        //核心组件
        {
          "title": 'abcdd', //字段名称
          "type": 4, //单选0  多选1  文本2  图片3  附件4
          "tips": '', //字段提示
          "options": [] //字段选项
        },
        {
          "title": 'fff', //字段名称
          "type": 3, //单选0  多选1  文本2  图片3  附件4
          "tips": '', //字段提示
          "options": [] //字段选项
        }
      ],
      coreName: '核心区域', //核心组件名字
      coreDown: [
        {
          "title": 'abcdd', //字段名称
          "type": 4, //单选0  多选1  文本2  图片3  附件4
          "tips": '', //字段提示
          "options": [] //字段选项
        },
        {
          "title": 'fff', //字段名称
          "type": 3, //单选0  多选1  文本2  图片3  附件4
          "tips": '', //字段提示
          "options": [] //字段选项
        }
      ] //核心组件下面的
    }
  },
  {
    "name": '超级模板2222', //模板名字
    "status": 0, //0不可被前台看到  1 可以被前台看到
    "data": {
      "coreUp": [
        {
          "title": 'abcddfffff', //字段名称
          "type": 4, //单选0  多选1  文本2  图片3  附件4
          "tips": '', //字段提示
          "options": [] //字段选项
        }
      ], //核心组件上面的
      "core": [
        //核心组件
        {
          "title": 'abcdd', //字段名称
          "type": 4, //单选0  多选1  文本2  图片3  附件4
          "tips": '', //字段提示
          "options": [] //字段选项
        },
        {
          "title": 'fff', //字段名称
          "type": 3, //单选0  多选1  文本2  图片3  附件4
          "tips": '', //字段提示
          "options": [] //字段选项
        }
      ],
      "coreName": '核心区域', //核心组件名字
      "coreDown": [
        {
          "title": 'abcdd', //字段名称
          "type": 4, //单选0  多选1  文本2  图片3  附件4
          "tips": '', //字段提示
          "options": [] //字段选项
        }
      ] //核心组件下面的
    }
  }
])

//模拟当前的选中项
let currentList = ref(dataList[0])
const addFormVisible = ref(false)
const addFormVisible2 = ref(false)
const dialogFormVisible = ref(false)
const dialogFormVisible2 = ref(false)
const dialogFormVisible3 = ref(false)

//点信息
const detail = reactive({ "code": -1, "direction": -1, "index": -1 })
let rowDetail = reactive({})
let rowDetail2 = reactive({})
let rowDetail3 = reactive({})

//点击左侧 右侧回显
const show = (index) => {
  heightLight.value = index
  currentList.value = dataList[index]
}
//左侧开关
const switchClick = () => {

}
//左侧编辑
/**添加
 * @param {Number} code  0核心区域上方  1核心区域内   2核心区域   3核心区域下方
 * @param {Number} direction 0往上插入 1往下插入
 * @param {Number | Undefined} index  当前项*/
const addClick = (code, direction, index) => {
  detail.code = code
  detail.direction = direction
  detail.index = index
  addFormVisible.value = true
}

/**添加后的逻辑
 * @param {Object} form  要添加的form表单数据*/
const add = (form) => {
  const code = detail.code
  const direction = detail.direction
  const index = detail.index
  if (code == 0) {
    const list = currentList.value.data.coreUp
    if (direction == 0) {
      list.splice(index, 0, form)
    } else if (direction == 1) {
      list.splice(index + 1, 0, form)
    }
  } else if (code == 1) {
    const list = currentList.value.data.core
    if (direction == 0) {
      list.splice(index, 0, form)
    } else if (direction == 1) {
      list.splice(index + 1, 0, form)
    }
  } else if (code == 2) {
    let list
    if (direction == 0) {
      list = currentList.value.data.coreUp
      list.push(form)
    } else if (direction == 1) {
      list = currentList.value.data.coreDown
      list.unshift(form)
    }
  } else if (code == 3) {
    const list = currentList.value.data.coreDown
    if (direction == 0) {
      list.splice(index, 0, form)
    } else if (direction == 1) {
      list.splice(index + 1, 0, form)
    }
  }
  ElMessage({
    message: '添加成功',
    type: 'success',
    plain: true
  })
}

/**
 * @param {Number} code
 * @return {Object}*/
const returnDetail = (code) => {
  let list
  if (code == 0) {
    list = currentList.value.data.coreUp
  } else if (code == 1) {
    list = currentList.value.data.core
  } else if (code == 3) {
    list = currentList.value.data.coreDown
  }
  return list
}

/**编辑
 * @param {Number} code  0核心区域上方  1核心区域内   3核心区域下方
 * @param {Number} index  当前项*/
const editClick = (code, index) => {
  detail.code = code
  detail.direction = undefined
  detail.index = index
  let list = returnDetail(code)
  rowDetail = list[index]
  dialogFormVisible.value = true
}

/**修改后的逻辑
 * @param {Object} form  要修改的form表单数据*/
const edit = (form) => {
  const code = detail.code
  const index = detail.index
  let list = returnDetail(code)
  list[index] = form
  ElMessage({
    message: '修改成功',
    type: 'success',
    plain: true
  })
}

const editClick2 = (coreName) => {
  rowDetail2 = { coreName }
  dialogFormVisible2.value = true
}
const edit2 = (form) => {
  currentList.value.data.coreName = form.coreName
}

const editClick3 = (index) => {
  rowDetail3 = { name: dataList[index].name, index }
  dialogFormVisible3.value = true
}
const edit3 = (form) => {
  dataList[rowDetail3.index].name = form.name
}

const addClick2 = () => {
  addFormVisible2.value = true
  console.log('新增模板', dataList)
}
const add2 = (form) => {
  dataList.push(form)
  if (dataList.length === 1) {
    heightLight.value = 0
    currentList.value = form
  }
  ElMessage({
    message: '添加成功',
    type: 'success',
    plain: true
  })
}

/**删除
 * @param {Number} code  0核心区域上方  1核心区域内   3核心区域下方
 * @param {Number} index  当前项*/
const delClick = (code, index) => {
  detail.code = code
  detail.direction = undefined
  detail.index = index
  let list = returnDetail(code)
  list.splice(index, 1)
  ElMessage({
    message: '删除成功',
    type: 'success',
    plain: true
  })
}

/**
 * 删除模板
 * @parameter{Number} index 当前项*/
const delClick2 = (index) => {
  dataList.splice(index, 1)
  if (heightLight.value == index) {
    if (index != 0) {
      heightLight.value = index - 1
      currentList.value = dataList[index - 1]
    } else {
      heightLight.value = index
      if (dataList.length > 0) {
        currentList.value = dataList[index]
      }
    }
  }
  ElMessage({
    message: '删除成功',
    type: 'success',
    plain: true
  })
}
</script>
<style lang="scss" scoped>
.video-script {
  width: 100%;
  min-width: 800px;
  //border: 1px solid red;
  display: flex;

  .left {
    width: 400px;
    height: 85vh;
    //border: 1px solid black;
    overflow-y: auto;

    .header {
      display: flex;
      height: 60px;
      line-height: 60px;
      justify-content: space-between;
    }

    .wd {
      height: 60px;
      line-height: 60px;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 0px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      //border: 1px solid black;
      .wd_r {
        //border: 1px solid red;
        width: 110px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
      }
    }
  }

  .right {
    flex: 1;
    margin-left: 10px;
    height: 85vh;
    //border: 1px solid orange;
    .core_else {
      width: 100%;
      height: 50px;
      //border: 1px solid red;
      margin-top: 10px;
      display: flex;
      border: none;
      font-size: 20px;

      .core_else_l {
        height: 100%;
        width: 340px;
        background: #cce6f6;
        display: flex;

        .title {
          display: inline-block;
          height: 100%;
          padding-left: 28px;
          line-height: 50px;
          font-size: 16px;
        }

        .edit {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 12px;
          color: #409eff;
          cursor: pointer;
        }
      }

      .core_else_m {
        flex: 1;
        border: 1px solid rgba(0, 0, 0, 0.1);
        text-align: center;
        line-height: 50px;
      }

      .core_else_r {
        width: 54px;
        height: 100%;
        //border: 1px solid red;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: none;
        color: #409eff;
      }
    }

    .core {
      width: 100%;
      height: 180px;
      //border: 1px solid orange;
      margin-top: 16px;
      display: flex;
      gap: 10px;

      .core_left {
        width: 52px;
        height: 100%;
        //border: 1px solid red;
        background: #cce6f6;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .name {
          writing-mode: vertical-rl;
          //border: 1px solid blue;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .edit {
          font-size: 20px;
          width: 100%;
          //border: 1px solid black;
          text-align: center;
          padding-top: 4px;
          color: #409eff;
          cursor: pointer;
        }
      }

      .core_item {
        flex: 1;
        //border: 1px solid blue;
        display: flex;
        flex-direction: column;

        .top {
          width: 100%;
          height: 46px;
          //border: 1px solid red;
          background: #cce6f6;
          display: flex;
          justify-content: space-between;

          .top_1 {
            height: 100%;
            //border: 1px solid orange;
            display: flex;

            .top_1_1 {
              padding-left: 8px;
              height: 100%;
              //border: 1px solid black;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .top_1_2 {
              padding-left: 8px;
              height: 100%;
              //border: 1px solid black;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 20px;
              color: #409eff;
              cursor: pointer;
            }
          }

          .top_2 {
            //border: 1px solid black;
            height: 100%;
            width: 54px;
            font-size: 20px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            border: none;
            color: #409eff;
          }
        }

        .bottom {
          width: 100%;
          flex: 1;
          //border: 1px solid black;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-top: none;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
        }
      }

      .core_option {
        width: 44px;
        height: 100%;
        //border: 1px solid orange;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #409eff;
      }
    }
  }

  //el-card自定义滚动条
  .content {
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #b0b0b0;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
}
</style>
