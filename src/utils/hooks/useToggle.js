import {ref, onMounted} from 'vue';

/**
 * @param {Boolean} initialValue
 * @return {Number}*/
export function useToggle(initialValue = false) {
    const state = ref(initialValue);
    state.value = !state.value;
    return state.value;
}
