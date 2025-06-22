import axios from "axios";
import serverConfig from "./config";
import qs from 'qs'; //序列化post内容的格式

//创建实例，使用自定义配置新建一个axios实例
const serviceAxios = axios.create({
    baseURL: serverConfig.baseURL,
    timeout: 10000,
});

//请求拦截
serviceAxios.interceptors.request.use((config) => {
        console.log('请求配置', config)
        /**
         * 业务逻辑
         * ....
         * ....
         * ....*/
        if(serverConfig.useTokenAuthorization){
            config.headers['Authorization']=localStorage.getItem("token"); // 请求头携带 token;
        }
        if(!config.headers["Content-Type"]) { // 如果没有设置请求头
            if(config.method === 'post') {
                config.headers["Content-Type"] = "application/x-www-form-urlencoded"; // post 请求
                config.data = qs.stringify(config.data); // 序列化,比如表单数据
            } else {
                config.headers["Content-Type"] = "application/json"; // 默认类型
            }
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

//响应拦截
serviceAxios.interceptors.response.use((res) => {
        console.log('响应结果', res)
        return res.data
    },
    (error) => {
        console.log('响应拦截', error);
        let message = "";
        if (error && error.response) {
            switch (error.response.status) {
                case 302:
                    message = "接口重定向了！";
                    break;
                case 400:
                    message = "参数不正确！";
                    break;
                case 401:
                    //https://blog.csdn.net/weixin_53945110/article/details/117635844
                    /**
                     * 1.获取refreshToken
                     * 2.如果refreshToken存在，
                     *    使用refreshToken获取新的token,成功后同步vuex，
                     *    不成功说明refreshToken过期了，就清除vuex中的token，然后通过router.push跳转到登录页。
                     * 3.如果refreshToken不存在，清除vux中的token,然后跳转登录页
                     * */
                    message = "您未登录，或者登录已经超时，请先登录！";
                    break;
                case 403:
                    message = "您没有权限操作！";
                    break;
                case 404:
                    message = `请求地址出错: ${error.response.config.url}`;
                    break;
                case 408:
                    message = "请求超时！";
                    break;
                case 409:
                    message = "系统已存在相同数据！";
                    break;
                case 500:
                    message = "服务器内部错误！";
                    break;
                case 501:
                    message = "服务未实现！";
                    break;
                case 502:
                    message = "网关错误！";
                    break;
                case 503:
                    message = "服务不可用！";
                    break;
                case 504:
                    message = "服务暂时无法访问，请稍后再试！";
                    break;
                case 505:
                    message = "HTTP 版本不受支持！";
                    break;
                default:
                    message = "异常问题，请联系管理员！";
                    break;
            }
        }
        return Promise.reject(message);
    }
)

export default serviceAxios;
