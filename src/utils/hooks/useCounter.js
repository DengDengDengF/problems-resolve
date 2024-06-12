import {reactive} from 'vue';


/**
 * @param {number} initialValue  初始值
 * @param {number} flag  0执行减法，1执行加法
 * @return {number}*/
export function useCounter(initialValue = 0, flag) {
    const count = reactive({
        value: initialValue
    });

    const increment = () => {
        count.value++;
    };

    const decrement = () => {
        count.value--;
    };
    flag === 0 ? decrement() : increment();
    return count.value;
}
