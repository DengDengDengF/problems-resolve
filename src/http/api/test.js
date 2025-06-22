import serviceAxios from "../index";

export const add = (params) => {
    return serviceAxios({
        url: "api/add",
        method: 'get',
        params,
    })
}

//按理说这个接口应该写成get的
export const echo = (data) => {
    return serviceAxios({
        url: "api/echo",
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        data,
    });
};
