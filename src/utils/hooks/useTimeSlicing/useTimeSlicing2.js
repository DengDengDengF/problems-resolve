/**
 * 长列表渲染，虚拟列表要比时间分片效率高
 * 时间分片的优势在于，需要处理大量计算任务且需要保持UI流畅的场景。
 *
 * 1.计算时间片，一次性渲染多少个(eachRenderNum )，总数据(originalList)除以，得到总共渲染多少次(times)。
 * 2.开始渲染数据，通过 index > times 判断渲染完成，如果没有渲染完成，那么通过 requestIdleCallback 浏览器空闲执行下一帧渲染
 * 3.通过 renderList 把已经渲染的 element 缓存起来.
 *
 * @param {Object} options   最外层容器、原始数据、每次渲染数量
 * @return [Array]*/
import {onMounted, ref} from "vue";

export const useTimeSlicing = (options) => {
    let renderList = ref([]);

    const {containerTarget, originalList, eachRenderNum} = options;


    const processChunk = function (deadline) {
        let startTime=performance.now();

    }

    /**
     * @param {number} index
     * @param {number} times
     * @return {void}*/
    const toRenderList = (index, times) => {
        if (index > times) return; /* 如果渲染完成，那么退出 */
        renderList.value.push(renderNewList(index));
        //浏览器空闲执行下一批渲染
        requestIdleCallback((deadline) => {
            // console.log(deadline.timeRemaining())
            toRenderList(++index, times);
        }, {timeout: 1000});
    }
    /**
     * @param {number} index
     * @return {Array}*/
    const renderNewList = (index) => {
        return originalList.slice(
            (index - 1) * eachRenderNum,
            index * eachRenderNum
        );
    }
    onMounted(() => {
        if (containerTarget.value) {
            const times = Math.ceil(originalList.length / eachRenderNum);
            let index = 1;
            toRenderList(index, times)
        }
    })

    return renderList;
}
