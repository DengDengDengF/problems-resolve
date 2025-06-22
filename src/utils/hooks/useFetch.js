import {reactive} from 'vue';

/**
 * @param {String} url  根据url调接口
 * @param {Object}      */
export async function useFetch(url) {
    const res = reactive({
        value: null,
        error: 'ok',
    });
    //防止 过早的return
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            res.value = data;
        })
        .catch(error => {
            res.error = error;
        });
    return res
}
