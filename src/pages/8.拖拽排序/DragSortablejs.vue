<template>
  <div>
    <el-table :data="tableData" id="dragTable" border style="width: 800px;">
      <el-table-column prop="date" label="Date" width="180"/>
      <el-table-column prop="name" label="Name" width="180"/>
      <el-table-column prop="address" label="Address"/>
    </el-table>
  </div>
</template>

<script>
//详情请看srotablejs官网
import Sortable from "sortablejs";
import {onMounted, reactive} from "vue";
import {ElTable,ElTableColumn} from "element-plus";
export default {
  name: "DragSortablejs",
  components:{ElTable,ElTableColumn},
  setup(props) {
    const tableData = reactive([
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Cilly',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Linda',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'John',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ]);

    function setSort() {
      const el = document.querySelector('#dragTable table tbody')
      new Sortable(el, {
        sort: true,
        ghostClass: 'sortable-ghost',
        onEnd: (e) => {
          const targetRow = tableData.splice(e.oldIndex, 1)[0]
          tableData.splice(e.newIndex, 0, targetRow)
          console.log(tableData)
        },
      })
    }
    onMounted(()=>{
      setSort()
    })
    return {
      tableData,
    }
  }
}
</script>


<style scoped>

</style>
