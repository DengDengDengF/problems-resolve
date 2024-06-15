import {ref, watchEffect} from 'vue';

export function useLatest(value) {
    const latestValue = ref(value);
    latestValue.value = value;
    return latestValue.value;
}
