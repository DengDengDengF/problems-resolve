// 模拟的API调用函数
async function fetchCode(token) {
    // 模拟API请求，实际请求时需要更改为具体的接口
    const response = await fetch('/api/getCode', {
        method: 'POST',
        headers: {'Authorization': `Bearer ${token}`},
    });
    const data = await response.json();
    return data.code;
}

async function loginUser(username, password) {
    // 模拟登录请求
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
    });
    const data = await response.json();
    if (data.token) {
        document.cookie = `token=${data.token}; path=/`;
        return data.token;
    } else {
        throw new Error('登录失败');
    }
}

function getDomain() {
    return document.domain;
}

async function handleRedirect() {
    //共享全局登录状态的token
    const token = getCookie('token');
    if (!token) {
        // 如果没有token，重定向到登录页面
        window.location.href = '/login';
        return;
    }
    //用token换取code.code授权码可以后续用来换令牌(refreshToken、accessToken等)
    const code = await fetchCode(token);
    //code为啥可以是空？因为有可能共享全局状态的token失效了。
    if (!code) {
        // 如果code为空，清除cookie并重定向到登录页面
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/login';
        return;
    }

    const redirectUrl = new URLSearchParams(window.location.search).get('redirectUrl');
    const currentDomain = getDomain();
    const targetUrl = new URL(redirectUrl);

    if (targetUrl.hostname === currentDomain) {
        // 同域，直接跳转
        window.location.href(redirectUrl);
    } else {
        // 第三方系统，处理code
        const updatedRedirectUrl = `${redirectUrl}?code=${code}`;
        window.location.replace(updatedRedirectUrl);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// 登录按钮点击事件
function login() {
    document.getElementById('loginButton').addEventListener('click', async () => {
        try {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            //输入用户名，输入密码，登录成功可以拿到token,这里的token只是为了共享登录状态
            await loginUser(username, password);
            handleRedirect();
        } catch (error) {
            console.error('登录过程出错:', error);
        }
    });
}

export {login};
