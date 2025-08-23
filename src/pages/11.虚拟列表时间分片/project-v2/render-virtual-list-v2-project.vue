<!-- 仅仅用作项目，在此处没有数据 -->
<template>
  <div class="container" ref="outerContainer">
    <div ref="wrapperArea">
      <div ref="renderArea" class="card-list-v2">
        <template v-for="item in rowList" :key="item.id">
          <material-card
            class="material-card-v2"
            :cardItem="item"
            :cardIndex="item.index"
            :isClassification="true"
            :selected-state="selectedState"
            :category="props.category"
            :media_channel_type="props.media_channel_type"
            @videoClick="emits('handleVideoClick', $event)"
            @checkedChange="emits('handleCheckedChange', $event, item.index)"
            @refresh="emits('fetchData', $event)"
            @materialClick="emits('handleMaterialClick', $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted, computed } from 'vue'
import { useVirtualList } from '@/hooks/useVirtualList'
import type { checkedBtnSelectedStateType, classificationCategoryType } from '@/types'
import MaterialCard from '@/components/material-card/material-card.vue'
import { debounce } from 'lodash'

const emits = defineEmits([
  'handleVideoClick',
  'handleCheckedChange',
  'fetchData',
  'handleMaterialClick'
])
const props = defineProps<{
  videoList: any[]
  isClassification: boolean
  btnSelectedState: checkedBtnSelectedStateType
  category: classificationCategoryType
  media_channel_type: number
  selectedMaterialList: any[]
  specialPro: boolean
}>()
const selectedState = computed(() => props.btnSelectedState)
/**-------------------以上是业务逻辑-------------------------------------------*/
/**-------------------------------以下是虚拟列表逻辑----------------------------------------*/
const outerContainer = ref()
const originalList = ref<any[]>([])
const overscan = 2
const wrapperArea = ref()
const renderArea = ref()
const whatHeightMode = ref<number>(0)
const eachRowNum = ref<number>(0)
let rowList = useVirtualList({
  containerTarget: ref(document.documentElement),
  originalList,
  overscan,
  wrapperArea,
  whatHeightMode,
  renderArea,
  eachRowNum
}).targetList

/**
 * 计算当前屏幕宽度下每行卡片数量和卡片尺寸
 * @returns 卡片信息对象
 */
const getCardLayoutInfo = () => {
  const screenWidth = window.innerWidth
  const gap = 14
  let cardsPerRow: number
  // 根据媒体查询确定每行卡片数量
  if (screenWidth > 1910) {
    cardsPerRow = 8
  } else if (screenWidth > 1568) {
    cardsPerRow = 7
  } else if (screenWidth > 1376) {
    cardsPerRow = 6
  } else if (screenWidth > 1168) {
    cardsPerRow = 5
  } else {
    cardsPerRow = 4
  }
  const actualContainerWidth = outerContainer.value?.clientWidth || screenWidth
  const totalGapWidth = (cardsPerRow - 1) * gap
  const cardWidth = (actualContainerWidth - totalGapWidth) / cardsPerRow
  const cardHeight: number = cardWidth * (16 / 9) + gap
  return {
    cardsPerRow,
    cardHeight: Math.ceil(cardHeight)
  }
}
const updateFun = debounce(() => {
  const { cardsPerRow, cardHeight } = getCardLayoutInfo()
  whatHeightMode.value = cardHeight
  eachRowNum.value = cardsPerRow
}, 200)

onMounted(() => {
  updateFun()
  window.addEventListener('resize', updateFun)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateFun)
})

watch(
  () => props.selectedMaterialList,
  () => {
    const mySet = new Set()
    for (let item of props.selectedMaterialList) mySet.add(item.id)
    for (let item of rowList.value) item.checked = mySet.has(item.id)
  }
)

watch(
  () => props.videoList,
  () => {
    //materialList 因为某些store原因置空，但是又不可以影响虚拟列表滚动条逻辑
    if (props.videoList.length == 0 && props.specialPro) return
    originalList.value = props.videoList?.map(
      (item, i) =>
        ({
          ...item,
          index: i
        }) ?? []
    )
  }
)
</script>

<style scoped lang="scss">
.container {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;

  .card-list-v2 {
    display: grid;
    gap: 14px;
    /* 设置卡片之间的间距 */
    /* 默认情况下设置每行的列数 */
    grid-template-columns: repeat(auto-fill, minmax(calc(12.5% - 14px), 1fr));

    .material-card-v2 {
      aspect-ratio: 9 / 16;
      /* 强制保持宽高比例 */
    }

    /* 根据屏幕宽度调整每行卡片数量 */
    @media (max-width: 1910px) {
      grid-template-columns: repeat(auto-fill, minmax(calc(14.2857% - 14px), 1fr));
      /* 每行7个卡片 */
    }

    @media (max-width: 1568px) {
      grid-template-columns: repeat(auto-fill, minmax(calc(16.6667% - 14px), 1fr));
      /* 每行6个卡片 */
    }

    @media (max-width: 1376px) {
      grid-template-columns: repeat(auto-fill, minmax(calc(20% - 14px), 1fr));
      /* 每行5个卡片 */
    }

    @media (max-width: 1168px) {
      grid-template-columns: repeat(auto-fill, minmax(calc(25% - 14px), 1fr));
      /* 每行4个卡片 */
    }
  }
}
</style>
