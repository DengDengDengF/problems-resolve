import {ref, onMounted, watch} from 'vue';

const defaultSize = {width: 0, height: 0};

export function useSize(containerRef, initialState = defaultSize) {
    const size = ref(initialState);
    if (containerRef) {
        const {clientWidth, clientHeight} = containerRef;
        size.value = {width: clientWidth, height: clientHeight};
    }
    return size.value;
}
