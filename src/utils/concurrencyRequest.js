// 并发请求函数
/*
* 代码刚开始循环的时候就控制了最大一次性请求的数量，但是finally里面还做了一次递归。
* 再回来看下，for循环里面循环很快就会执行完，后面的请求都是对循环里面第一次请求的递归*/
export const concurrencyRequest = (urls, maxNum) => {
    return new Promise((resolve) => {
        if (urls.length === 0) {
            resolve([]);
            return;
        }
        const results = [];
        let index = 0; // 下一个请求的下标
        let count = 0; // 当前请求完成的数量

        // 发送请求
        async function request() {
            if (index === urls.length) return;
            const i = index; // 保存序号，使result和urls相对应
            const url = urls[index];
            index++;
            console.log(url); //
            try {
                const resp = await fetch(url);
                // resp 加入到results
                results[i] = resp;
            } catch (err) {
                // err 加入到results
                results[i] = err;
            } finally {
                count++;
                // 判断是否所有的请求都已完成
                if (count === urls.length) {
                    console.log('完成了');
                    resolve(results);
                }
                request();
            }
        }

        // maxNum和urls.length取最小进行调用
        const times = Math.min(maxNum, urls.length);
        for (let i = 0; i < times; i++) {
            request();
        }
    })
}

//队列的方式解决并发
export   class TaskQueue {
    constructor() {
        this.max = 5; //最大并发数
        this.taskList = [] //用shift方法实现先进先出
        setTimeout(() => { //这里初始化队列后自动执行，后续有新任务添加则需要手动执行。
            this.run()
        })
    }

    addTask(task) {
        this.taskList.push(task);
    }

    run() {
        const length = this.taskList.length;
        if (!length) {
            return;
        }
        const min = Math.min(length, this.max);// 控制并发数量
        for (let i = 0; i < min; i++) {
            this.max--; //开始占用一个任务的空间
            const task = this.taskList.shift();
            task().then(res => {
                console.log(res);
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.max++; //任务完成，释放空间
                this.run();//自动进行下一个任务
            })
        }
    }
}
