// 并发请求函数
/**不要求异步调用顺序---->代码刚开始循环的时候就控制了最大一次性请求的数量，但是finally里面还做了一次递归。
 * 再回来看下，for循环里面循环很快就会执行完，后面的请求都是对循环里面第一次请求的递归
 * @param {Array} urls
 * @param {Number} maxNum*/
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

/**
 * 不要求异步调用顺序---->队列的方式解决并发
 * @param {number} max 最大并发数
 * @param {Array} taskList 所有并发数据(还没调用结果)，
 * @param {Function} addTask 往taskList中添加(还没调用结果的)数据
 * @param {Function} run 利用执行栈中的顺序，先同步后异步,维护并发队列的长度;出队列之前，队列长度--；有回调结果后，队列长度++，进行下一个任务
 *
 * ；*/
export class TaskQueue {
    constructor() {
        this.max = 5; //最大并发数
        this.taskList = [] //用shift方法实现先进先出
        setTimeout(() => { //宏任务异步，这里初始化队列后自动执行，后续有新任务添加则需要手动执行。
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


/**
 * 要求异步调用顺序，并且要一批完成后才能下一批。
 * @param {Array} arr  包含多个url的数组，
 * @param {Number} maxRequestLength 最大一次性请求接口数
 * @param {Function} callback 执行请求的函数
 * */
export const sortRequest = function (arr, maxRequestLength, callback) {
    if (arr.length < 1) return
    let minRequestLength = Math.min(maxRequestLength, arr.length);
    let promises = arr.splice(0, minRequestLength).map((item, index) => {
        return callback(item, minRequestLength);
    });
    Promise.all(promises).then((allData) => {
        console.log('------>', allData);
        sortRequest(arr, maxRequestLength, callback);
    }).catch((err) => {
        console.log('------>', err);
    })
}

/**
 * @param{Array} arr 包含多个url的数组，
 * @param{Function} callback 执行请求的函数
 * */
export const byRequest = function (arr, callback) {
    if (arr.length < 1) return;
    callback(arr.shift()).then((result) => {
        console.log('------>', result);
        byRequest(arr, callback);
    }).catch((error) => {
        console.log('------>', error);
    })
}
