import {onMounted} from "vue";

let array = [] // 接受外部数组
let returnArray = [];
let index = 0; // 当前处理的数组索引
let initialTaskSize = 500; // 初始任务量
let currentTaskSize = initialTaskSize; // 当前任务量
let maxAllowedTime = 16; // 每个时间片允许的最大执行时间（毫秒）

/**
 *
 * */
export function useTimeSlicing(originalList, list, styles) {
    array = originalList;
    returnArray = list;
    onMounted(() => {
        function processChunk(deadline) {
            let startTime = performance.now(); // 记录开始时间
            while (index < array.length && (deadline.timeRemaining() > 0 || performance.now() - startTime < maxAllowedTime)) {
                // 处理当前任务量的元素
                for (let i = 0; i < currentTaskSize && index < array.length; i++) {
                    // 模拟处理任务
                    returnArray.value[index] = currentTaskSize[index];
                    // array[index] += 1;
                    index++;
                }
                // console.log(list.value)
                // 动态调整任务量
                let elapsedTime = performance.now() - startTime;
                if (elapsedTime > maxAllowedTime) {
                    currentTaskSize = Math.max(1, Math.floor(currentTaskSize / 2)); // 如果超时，减少任务量
                } else if (elapsedTime < maxAllowedTime / 2) {
                    currentTaskSize = Math.min(array.length - index, currentTaskSize * 2); // 如果执行时间小于一半，增加任务量
                }
            }

            // 如果还有未完成的任务，继续调度
            if (index < array.length) {
                requestIdleCallback(processChunk);
            } else {
                console.log('所有任务已完成');
                styles.overflow = 'auto';
            }
        }
        // 开始任务调度
        requestIdleCallback(processChunk);
    })
}




