/**探索单点登录，同域情况下配置一个主域就行，但是不支持跨域，
 *  cookie 域名一样，端口号不一样可以获取
 *  localstorage 域名一样，端口号不一样不能获取
 * 调用这个函数的demo,进行验证。
 * @return {void}*/
function createCookies() {
    //不跨域可以拿到
    document.cookie = "user1=ChengLong; expires=Thu, 18 Dec 2029 12:00:00 GMT; path=/;";
    document.cookie = "user2=LDF; expires=Thu, 18 Dec 2029 12:00:00 GMT; path=/;domain=localhost";

    //跨域不能拿到
    document.cookie = "user3=WangBaoQiang; expires=Thu, 18 Dec 2028 12:00:00 GMT; path=/;domain=example.com";
}

export {createCookies};