<template>
  <div  class="material-table-list">
    <el-table
        class="el-table"
        :data="tableData"
        stripe
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" fixed="left" />
      <el-table-column label="类目" show-overflow-tooltip>
        <template #default="{ row }">
          {{console.log('dafafadfa')}}
          <span>{{ row.category_name }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce'
/**
 *  公司项目里的，每个双向绑定的checkBox更新都会渲染整个table，table插槽中有很多复杂的布局，渲染几百条直接卡死。
 *  优化思路：
 *  1.自己写checkBox,用原生dom去判断全选/半选/未选中
 *  2.用requestAnimationFrame,批量一次50条，确保不会阻塞主线程
 *  3.几百条更新完毕后，用requestIdleCallback去执行其他同事写的时间复杂度相对高的逻辑。
 * */
const props = withDefaults(
    defineProps<{
      videoList: any[]
      loading: boolean
      isTaskPage?: boolean // 是否是任务页面
      taskId?: number // 任务id，在任务页面此参数有效
    }>(),
    {
      isTaskPage: false
    }
)
const tableData=[]
for(let i=0;i<400;i++){
  tableData.push({id:++i,category_name:1234+i},)
}
//多选
const handleSelectionChange = debounce((selection: any[]) => {

}, 100)

</script>

<style scoped lang="scss">
.material-table-list {
  width: 100%;

  .el-table {
    .operation {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: gray;
      span {
        margin-right: 10px;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
      .more-icon {
        transform: rotate(-90deg);
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
    .video-info-container {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
      cursor: pointer;
      .cover {
        width: 80px;
        border-radius: 10px;
        background: #f4f4f5;
        min-height: 80px;
        //border:1px solid red;
        display: flex;
        justify-content: center;
        align-items: center;
        :deep(.el-image) {
          width: 60%;
          height: 100%;
          object-fit: cover;
        }
        .none-image {
          text-align: center;
          font-size: 12px;
        }
        .image-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background: rgb(245, 247, 250);
          color: rgb(169, 172, 178);
          font-size: 12px;
          .tips {
            margin-top: 6px;
          }
        }
      }
      .render-detail {
        flex: 1;
        margin-left: 10px;
        .detail-name {
          font-size: 14px;
          color: #606266;
          white-space: normal;
          word-break: break-all;
        }
        .detail-id {
          font-size: 12px;
          color: gray;
        }
      }
      &:hover {
        .render-detail {
          .detail-name {
            color: #409eff;
          }
          .detail-id {
            color: rgb(159.5, 206.5, 255);
          }
        }
      }
    }
  }
}
</style>
