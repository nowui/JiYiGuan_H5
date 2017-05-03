const validate = {
    isPhone(str) {
        let re = /^1\d{10}$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    },
    isEmail(str) {
        let re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    }
};

export default validate;
