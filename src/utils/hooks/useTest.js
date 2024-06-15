import {computed, onMounted, ref, watch} from "vue";

export const useTest = () => {
    const data = ref(0);

    const comp = computed(() => {
        return data.value + 'computed'
    })

    watch(() => data.value, () => {
        console.log('watch')
        console.log(comp.value)
    })

    const testWatch = () => {
        data.value++;
    }

    onMounted(() => {
        console.log('useTest-->onMounted')
    })

    return {testWatch};
}
