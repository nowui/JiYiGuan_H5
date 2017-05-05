const validate = {
  isPhone(str) {
    const re = /^1\d{10}$/;
    if (re.test(str)) {
      return true;
    } else {
      return false;
    }
  },
  isEmail(str) {
    const re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (re.test(str)) {
      return true;
    } else {
      return false;
    }
  },
};

export default validate;
