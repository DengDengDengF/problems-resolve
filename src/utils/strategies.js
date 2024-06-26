var strategies = {
    isNonEmpty: function (value, errorMsg) {
        if (value === '' || value === null) {
            return errorMsg;
        }
    },
    isMobile: function (value, errorMsg) { // 手机号码格式
        if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    },
    minLength: function (value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg;
        }
    }
};
export {strategies}
