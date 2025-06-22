import {onMounted, ref, computed, watch, onUnmounted} from "vue";
import {isNumber} from './useNumber.js'
import {useSize} from "./useSize.js";
import {useLatest} from "./useLatest.js";

/**
 * @param {Object} options {最外层容器、原始数据、溢出、包裹容器的动态样式}
 * @return {Object}  截取的数据*/
export const useVirtualList = (options) => {
    const {containerTarget, originalList, overscan, wrapperStyle} = options;
    let targetList = ref([]);//截取后的数据
    /**
     * 模拟动态高度
     * @param {number} i
     * @return {number}
     * */
    const itemHeight = (i) => (i % 2 === 0 ? 42 + 8 : 42 + 8);
    const itemHeightRef = useLatest(itemHeight);
    /**
     * 用计算属性计算列表总体高度,避免重复运算
     * @return {number}*/
    const totalHeight = computed(() => {
        if (isNumber(itemHeightRef)) {
            return originalList.length * itemHeightRef;
        }
        let sum = 0;
        for (let i = 0; i < originalList.length; i++) {
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
        wrapperStyle.height = height;
        wrapperStyle.marginTop = marginTop;
        wrapperStyle.border = '1px solid red';
        document.title = '高=' + height + ' 距顶=' + marginTop
    }
    /**
     * 设置截取的数据
     * @param {Array} arr 截取后的数据
     * @return {void}*/
    const setTargetList = (arr) => {
        targetList.value = arr;
        // console.log(targetList.value)
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
        for (let i = 0; i < originalList.length; i++) {
            const height = itemHeightRef(i, originalList[i]);
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
        for (let i = fromIndex; i < originalList.length; i++) {
            const height = itemHeightRef(i, originalList[i]);
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
        const height = originalList
            .slice(0, index)
            .reduce((sum, _, i) => sum + itemHeightRef(i, originalList[i]), 0);
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
            const offset = getOffset(scrollTop);
            const visibleCount = getVisibleCount(clientHeight, offset);
            const start = Math.max(0, offset - overscan);
            const end = Math.min(originalList.length, offset + visibleCount + overscan);
            const offsetTop = getDistanceTop(start);
            // 设置wrapper的高度和偏移量
            setWrapperStyle(totalHeight.value - offsetTop + "px", offsetTop + "px");


            // 设置wrapper展示dom
            setTargetList(
                originalList.slice(start, end).map((ele, index) => ({
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
        e.preventDefault();
        calculateRange();
    };
    watch(() => originalList, () => {
        resize();
    })
    onMounted(() => {
        const {width, height} = useSize(containerTarget.value);
        if (containerTarget && originalList.length > 0 && width > 0 && height > 0) {
            calculateRange();
            containerTarget.value.addEventListener("scroll", resize);
            window.addEventListener('resize', resize);
        }

    })
    onUnmounted(() => {
        if (containerTarget.value && originalList.length > 0 && width > 0 && height > 0) {
            containerTarget.value.removeEventListener("scroll", resize);
            window.removeEventListener("resize", resize);
        }

    })

    return {targetList};
}
