import {onMounted, ref, computed, watch, onUnmounted} from "vue";
import {isNumber} from './useNumber.js'
import {useSize} from "./useSize.js";
import {useLatest} from "./useLatest.js";

/**
 * @param options.containerTarget 最外层容器 body/...
 * @param options.originalList 原始数据
 * @param options.overScan 溢出个数
 * @param options.wrapperArea 虚拟滚动区域的引用*
 * @return {Object}截取的数据*/
export const useVirtualList = (options) => {
    const {containerTarget, originalList, overscan, wrapperArea, constHeight, renderArea} = options;
    let targetList = ref([]);//截取后的数据
    let topDistance = 0
    //动态高度模拟
    const itemHeight = (i) => (i % 2 === 0 ? 42 + 8 : 42 + 8);
    const itemHeightRef = useLatest(constHeight ?? itemHeight);
    /**
     * 用计算属性计算列表总体高度,避免重复运算
     * @return {number}*/
    const totalHeight = computed(() => {
        if (isNumber(itemHeightRef)) {
            return originalList.value.length * itemHeightRef;
        }
        let sum = 0;
        for (let i = 0; i < originalList.value.length; i++) {
            sum += itemHeightRef(i);
        }
        return sum;
    });

    /**
     * 修改包裹容器样式
     * @param {String} height
     * @param {String} marginTop
     * @return {void}*/
    const setWrapperStyle = (height, marginTop) => {
        if (!wrapperArea.value) return
        if (!renderArea.value) return
        renderArea.value.style.transform = `translateY(${marginTop})`;
        renderArea.value.style.willChange = 'transform';
        wrapperArea.value.style.border = '1px solid red'
        // document.title = '高=' + height + ' 距顶=' + marginTop
    }
    /**
     * 设置截取的数据
     * @param {Array} arr 截取后的数据
     * @return {void}*/
    const setTargetList = (arr) => {
        targetList.value = arr;
    }
    /**
     * 计算对于container偏移量
     * @param {number} scrollTop
     * @returns
     */
    const getOffset = (scrollTop) => {
        if (isNumber(itemHeightRef)) {
            return Math.floor(scrollTop / itemHeightRef);
        }
        let sum = 0;
        let offset = 0;
        for (let i = 0; i < originalList.value.length; i++) {
            const height = itemHeightRef(i, originalList.value[i]);
            sum += height;
            if (sum >= scrollTop) {
                offset = i;
                break;
            }
        }
        return offset + 1;
    };
    /**
     * 计算可视数量
     * @param {number} containerHeight
     * @param {number} fromIndex
     * @returns
     */
    const getVisibleCount = (containerHeight, fromIndex) => {
        if (isNumber(itemHeightRef)) {
            return Math.ceil(containerHeight / itemHeightRef);
        }

        let sum = 0;
        let endIndex = 0;
        for (let i = fromIndex; i < originalList.value.length; i++) {
            const height = itemHeightRef(i, originalList.value[i]);
            sum += height;
            endIndex = i;
            if (sum >= containerHeight) {
                break;
            }
        }
        return endIndex - fromIndex;
    };

    /**
     * 获取距离顶部距离
     * @param {number} index
     * @returns
     */
    const getDistanceTop = (index) => {
        if (isNumber(itemHeightRef)) {
            const height = index * itemHeightRef;
            return height;
        }
        const height = originalList.value
            .slice(0, index)
            .reduce((sum, _, i) => sum + itemHeightRef(i, originalList.value[i]), 0);
        return height;
    };

    /**
     * 主要程序调入
     * @return {void}*/
    const calculateRange = () => {
        // 获取外部容器
        const container = containerTarget.value;
        if (container) {
            const {scrollTop, clientHeight} = container;
            const offset = getOffset(scrollTop - topDistance);
            const visibleCount = getVisibleCount(clientHeight, offset);
            const start = Math.max(0, offset - overscan);
            const end = Math.min(originalList.value.length, offset + visibleCount + overscan);
            const offsetTop = getDistanceTop(start);
            // 设置wrapper的高度和偏移量
            setWrapperStyle(totalHeight.value + "px", offsetTop + "px");
            // 设置wrapper展示dom
            setTargetList(
                originalList.value.slice(start, end).map((ele, index) => ({
                    data: ele,
                    index: index + start,
                }))
            );

        }
    };
    /**
     *
     * @returns*/
    const resize = (e) => {
        e?.preventDefault();
        calculateRange();
    };

    const initScroll = (newLength, oldLength) => {
        if (newLength >= oldLength) return
        containerTarget.value.scrollTop = 0
    }

    watch(() => originalList.value, (newVal, oldVal) => {
        initScroll(newVal.length, oldVal.length)
        resize();
    })
    onMounted(() => {
        if (wrapperArea?.value) {
            const rect = wrapperArea.value.getBoundingClientRect()
            const distanceFromTop = rect.top + window.scrollY
            topDistance = distanceFromTop ?? 0
            wrapperArea.value.style.height = totalHeight.value + 'px';
        }
        if (containerTarget && originalList.value.length > 0) {
            calculateRange();
            if (containerTarget.value === document.documentElement) {
                window.addEventListener('scroll', resize);
            } else {
                containerTarget.value.addEventListener("scroll", resize);
            }
            window.addEventListener('resize', resize);
        }
        window.addEventListener('resize', () => {
            console.log('fffffffffffffff')
        })
    })
    onUnmounted(() => {
        if (containerTarget.value && originalList.value.length > 0) {
            if (containerTarget.value === document.documentElement) {
                window.removeEventListener('scroll', resize);
            } else {
                containerTarget.value.removeEventListener("scroll", resize);
            }
            window.removeEventListener("resize", resize);
        }

    })

    return {targetList};
}
