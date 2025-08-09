import { onMounted, ref, computed, watch, onUnmounted, nextTick } from 'vue'
import { throttle } from 'lodash'

export const useVirtualList = (options) => {
    /**
     * @param containerTarget 最最最外层容器 body/...
     * @param originalList 原始数据
     * @param overscan 溢出个数
     * @param wrapperArea 撑起高度的容器
     * @param whatHeightMode 虚拟滚动区域item采用固定高度/动态高度
     * @param renderArea 负载transform滚动容器
     * */
    const { containerTarget, originalList, overscan, wrapperArea, whatHeightMode, renderArea } =
        options
    let targetList = ref([]) //截取后的数据
    //number类型检测
    const isNumber = (value) => {
        return typeof value === 'number' && !isNaN(value)
    }
    //获取最新的值
    const itemLatest = (value) => {
        const latestValue = ref(value)
        latestValue.value = value
        return latestValue.value
    }
    //仅仅用做动态高度模拟
    const itemHeight = (i) => (i % 2 === 0 ? 42 + 8 : 42 + 8)
    const itemHeightRef = itemLatest(whatHeightMode ?? itemHeight)
    //用计算属性计算列表总体高度,避免重复运算
    const totalHeight = computed(() => {
        if (isNumber(itemHeightRef)) {
            return originalList.value.length * itemHeightRef
        }
        let sum = 0
        for (let i = 0; i < originalList.value.length; i++) {
            sum += itemHeightRef(i, originalList.value[i])
        }
        return sum
    })

    /**
     * 修改包裹容器样式
     * @param height 容器的高度
     * @param marginTop 容器距离顶部距离
     */
    const setWrapperStyle = (height, marginTop) => {
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
    const setTargetList = (arr) => {
        // console.log('fff',arr,JSON.parse(JSON.stringify(originalList.value)))
        targetList.value = arr
    }
    /**
     * 计算对于container偏移量
     * @param scrollTop 偏移
     */
    const getOffset = (scrollTop) => {
        if (isNumber(itemHeightRef)) {
            return Math.floor(scrollTop / itemHeightRef)
        }
        let sum = 0
        let offset = 0
        for (let i = 0; i < originalList.value.length; i++) {
            const height = itemHeightRef(i, originalList.value[i])
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
    const getVisibleCount = (containerHeight, fromIndex) => {
        if (isNumber(itemHeightRef)) {
            return Math.ceil(containerHeight / itemHeightRef)
        }

        let sum = 0
        let endIndex = 0
        for (let i = fromIndex; i < originalList.value.length; i++) {
            const height = itemHeightRef(i, originalList.value[i])
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
    const getDistanceTop = (index) => {
        if (isNumber(itemHeightRef)) {
            const height = index * itemHeightRef
            return height
        }

        const height = originalList.value
            .slice(0, index)
            .reduce(
                (sum, _, i) => sum + itemHeightRef(i, originalList.value[i]),
                0
            )
        return height
    }
    //校正绝对位置
    const getInitTop = () => {
        if (!wrapperArea.value || !renderArea.value) return 0
        const wrapperStyle = window.getComputedStyle(wrapperArea.value);
        const paddingTop = parseFloat(wrapperStyle.paddingTop);
        return renderArea.value.offsetTop - paddingTop;
    }
    //主程序调用
    const calculateRange = () => {
        // 获取外部容器
        const container = containerTarget.value
        if (container) {
            const { scrollTop, clientHeight } = container
            const topDistance = getInitTop()

            const offset = Math.max(0, getOffset(scrollTop - topDistance))
            const visibleCount = getVisibleCount(clientHeight, offset)
            const start = Math.max(0, offset - overscan)
            const end = Math.min(originalList.value.length, offset + visibleCount + overscan)
            const offsetTop = getDistanceTop(start)
            console.log(topDistance,start,end)
            // 设置wrapper的高度和偏移量
            setWrapperStyle(totalHeight.value + 'px', offsetTop + 'px')
            // 设置wrapper展示dom
            setTargetList(originalList.value.slice(start, end))
        }
    }
    //窗口改变
    const resize = throttle((e) => {
        e?.preventDefault()
        requestAnimationFrame(() => {
            calculateRange()
        })
    }, 16)
    /**
     * 初始设置滚动
     * @param newLength 原始数据改变后的长度
     * @param oldLength 原始数据改变前的长度*/
    const initScroll = (newLength, oldLength) => {
        if (newLength >= oldLength) return
        containerTarget.value.scrollTop = 0
    }
    watch(
        () => originalList.value,
        (newVal, oldVal) => {
            initScroll(newVal?.length ?? 0, oldVal?.length ?? 0)
            resize()
        }
    )
    onMounted(async () => {
        await nextTick()
        if (containerTarget) {
            calculateRange()
            if (containerTarget.value === document.documentElement) {
                window.addEventListener('scroll', resize)
            } else {
                containerTarget.value.addEventListener('scroll', resize)
            }
            window.addEventListener('resize', resize)
        }
    })
    onUnmounted(() => {
        if (containerTarget.value) {
            if (containerTarget.value === document.documentElement) {
                window.removeEventListener('scroll', resize)
            } else {
                containerTarget.value.removeEventListener('scroll', resize)
            }
            window.removeEventListener('resize', resize)
        }
    })

    return { targetList }
}
