// 创建 Watcher 类
export class Watcher {
    constructor(updateFn) {
        this.updateFn = updateFn;
    }

    // 执行更新操作
    update() {
        this.updateFn();
    }
}

