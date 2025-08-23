import { onMounted, ref, computed, watch, onUnmounted, nextTick } from 'vue'
import { throttle } from 'lodash'
import debounce from 'lodash/debounce'

export const useVirtualList = (options: Record<string, any>) => {
  /**
   * @param containerTarget 最最最外层容器 body/...
   * @param originalList 原始数据
   * @param overscan 溢出个数
   * @param wrapperArea 撑起高度的容器
   * @param whatHeightMode 虚拟滚动区域item采用固定高度/动态高度
   * @param renderArea 负载transform滚动容器
   * @param eachRowNum 一行渲染多少个,默认传1
   * */
  const {
    containerTarget,
    originalList,
    overscan,
    wrapperArea,
    whatHeightMode,
    renderArea,
    eachRowNum
  } = options
  let targetList = ref<any[]>([]) //截取后的数据
  //number类型检测
  const isNumber = (value: any) => {
    return typeof value === 'number' && !isNaN(value)
  }
  // 计算总行数
  const totalRows = computed(() => {
    return eachRowNum.value > 0 ? Math.ceil(originalList.value.length / eachRowNum.value) : 0
  })

  //用计算属性计算列表总体高度,避免重复运算
  const totalHeight = computed(() => {
    if (isNumber(whatHeightMode.value)) {
      return totalRows.value * whatHeightMode.value
    }
    let sum = 0
    for (let i = 0; i < totalRows.value; i++) {
      sum += whatHeightMode.value(i * eachRowNum.value, originalList.value[i * eachRowNum.value])
    }
    return sum
  })
  /**
   * 修改包裹容器样式
   * @param height 容器的高度
   * @param marginTop 容器距离顶部距离
   */
  const setWrapperStyle = (height: string, marginTop: string) => {
    if (!wrapperArea.value || !renderArea.value) return
    const computedStyle = window.getComputedStyle(wrapperArea.value)
    if (computedStyle.height != height) {
      wrapperArea.value.style.height = height
    }
    renderArea.value.style.transform = `translateY(${marginTop})`
    renderArea.value.style.willChange = 'transform'
    // wrapperArea.value.style.border = '1px solid orange'
    // document.title = '高=' + height + ' 距顶=' + marginTop
  }
  /**
   * 设置截取的数据
   * @param  arr 截取后的数据
   */
  const setTargetList = (arr: any[]) => {
    // console.log('fff',arr,JSON.parse(JSON.stringify(originalList.value)))
    targetList.value = arr
  }
  /**
   * 计算对于container偏移量
   * @param scrollTop 偏移
   */
  const getOffset = (scrollTop: number) => {
    if (isNumber(whatHeightMode.value)) {
      return whatHeightMode.value > 0 ? Math.floor(scrollTop / whatHeightMode.value) : 0
    }
    let sum = 0
    let offset = 0
    for (let i = 0; i < originalList.value.length; i++) {
      const height = whatHeightMode.value(
        i * eachRowNum.value,
        originalList.value[i * eachRowNum.value]
      )
      sum += height
      if (sum >= scrollTop) {
        offset = i
        break
      }
    }
    return offset + 1
  }
  /**
   * 计算可视数量
   * @param containerHeight container容器的高度
   * @param fromIndex 从下标开始计算
   */
  const getVisibleCount = (containerHeight: number, fromIndex: number) => {
    if (isNumber(whatHeightMode.value)) {
      return whatHeightMode.value > 0 ? Math.ceil(containerHeight / whatHeightMode.value) : 0
    }
    let sum = 0
    let endIndex = 0
    for (let i = fromIndex; i < totalRows.value; i++) {
      const height = whatHeightMode.value(
        i * eachRowNum.value,
        originalList.value[i * eachRowNum.value]
      )
      sum += height
      endIndex = i
      if (sum >= containerHeight) {
        break
      }
    }
    return endIndex - fromIndex
  }
  /**
   * 获取距离顶部距离
   * @param  index 下标
   */
  const getDistanceTop = (index: number) => {
    if (isNumber(whatHeightMode.value)) {
      return index * whatHeightMode.value
    }
    let height = 0
    for (let i = 0; i < index; i++) {
      height += whatHeightMode.value(i * eachRowNum.value, originalList.value[i * eachRowNum.value])
    }
    return height
  }
  //校正绝对位置。1.全局滚动：直接用差值  2.局部滚动：用当前 rect 与 scrollTop 的关系计算，不受 transform 影响
  const getInitTop = () => {
    if (!wrapperArea.value || !containerTarget.value) return 0
    const wrapperRect = wrapperArea.value.getBoundingClientRect()
    const containerRect = containerTarget.value.getBoundingClientRect()
    const fix = wrapperRect.top - containerRect.top
    return containerTarget.value === document.documentElement
      ? fix
      : fix + containerTarget.value.scrollTop
  }
  //主程序调用
  const calculateRange = () => {
    // 获取外部容器
    const container = containerTarget.value
    if (container) {
      const { scrollTop, clientHeight } = container
      const topDistance = getInitTop()
      const offsetRow = Math.max(0, getOffset(scrollTop - topDistance))
      const visibleRowCount = getVisibleCount(clientHeight, offsetRow)
      const startRow = Math.max(0, offsetRow - overscan)
      const endRow = Math.min(totalRows.value, offsetRow + visibleRowCount + overscan)
      const startItem = startRow * eachRowNum.value
      const endItem = Math.min(originalList.value.length, endRow * eachRowNum.value)
      const offsetTop = getDistanceTop(startRow)
      setWrapperStyle(totalHeight.value + 'px', offsetTop + 'px')
      setTargetList(originalList.value.slice(startItem, endItem))
    }
  }
  //窗口改变->节流
  const resizeThrottle = throttle((e?: Event) => {
    e?.preventDefault()
    requestAnimationFrame(() => {
      calculateRange()
    })
  }, 16)
  //窗口改变->防抖
  const resizeDebounce = debounce((e?: Event) => {
    e?.preventDefault()
    requestAnimationFrame(() => {
      calculateRange()
    })
  }, 200)
  /**
   * 初始设置滚动
   * @param newLength 原始数据改变后的长度
   * @param oldLength 原始数据改变前的长度*/
  const initScroll = (newLength: number, oldLength: number) => {
    if (newLength >= oldLength) return
    containerTarget.value.scrollTop = 0
  }
  //调接口后导致originalList改变
  watch(
    () => originalList.value,
    (newVal, oldVal) => {
      initScroll(newVal?.length ?? 0, oldVal?.length ?? 0)
      resizeThrottle()
    },
    {
      immediate: true
    }
  )
  watch([() => eachRowNum.value, () => whatHeightMode.value], () => {
    resizeDebounce()
  })
  onMounted(async () => {
    await nextTick()
    if (containerTarget) {
      if (containerTarget.value === document.documentElement) {
        window.addEventListener('scroll', resizeThrottle)
      } else {
        containerTarget.value.addEventListener('scroll', resizeThrottle)
      }
    }
  })
  onUnmounted(() => {
    if (containerTarget.value) {
      if (containerTarget.value === document.documentElement) {
        window.removeEventListener('scroll', resizeThrottle)
      } else {
        containerTarget.value.removeEventListener('scroll', resizeThrottle)
      }
    }
  })

  return { targetList }
}
