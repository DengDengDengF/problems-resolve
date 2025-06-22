<template>
  <div>
    <PDFView :pdfUrl="jsPdf" />
  </div>
</template>
<script setup lang="ts">
import PDFView from "../../components/pdfPreview.vue"
import jsPdf from "/static/ldf-reset.pdf"
</script>

<style scoped>

</style>
