import {ref} from 'vue';

export function useWindowSize() {
    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);

    width.value = window.innerWidth;
    height.value = window.innerHeight;
    console.log(width.value, height.value)
    return {width, height};
}
