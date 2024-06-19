// 创建依赖管理类 Dep
export class Dep {
    constructor() {
        // 用于存储依赖的订阅者
        this.subscribers = new Set();
    }

    // 添加订阅者
    depend(activeWatcher) {
        if (!this.subscribers.has(activeWatcher)) {
            this.subscribers.add(activeWatcher);
        }
    }

    // 通知所有订阅者进行更新
    notify() {
        this.subscribers.forEach((watcher)=>{
            // console.log(watcher)
            watcher.update()
        });
    }
}
