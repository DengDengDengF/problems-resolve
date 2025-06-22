import {Dep} from "./Dep.js";
import {Watcher} from "./Watcher.js";

let activeWatcher = null;
let data = null;
activeWatcher = new Watcher(() => {
    // 更新视图
    document.querySelector("#main").innerHTML = data;
});

// 将初始值放到页面上
export function ref(value) {
    const reactiveObj = {value};
    const dep = new Dep();
    //行为拦截
    let hander = {
        get(obj, key) {
            // console.log('触发了get,obj=', obj, '   ', 'key=', key);
            //这个watcher用的太傻逼了
            data = obj[key];
            if (activeWatcher) {
                dep.depend(activeWatcher); // 把依赖收集一下
            }
            if (key in obj) {
                return typeof obj[key] === 'object' ? new Proxy(obj[key], hander) : obj[key];
            } else {
                return undefined;
            }
        }, set(obj, key, val) {
            // console.log('触发了set,obj=', obj, '   ', 'key=', key, '   ', 'val=', val);
            obj[key] = val;
            dep.notify();
            return true
        }
    }
    return new Proxy(reactiveObj, hander);
}
