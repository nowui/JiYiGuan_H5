import constant from '../util/constant';

const wechat_open_id_key = 'wechat_open_id_' + constant.version;
const user_name_key = 'user_name_key_' + constant.version;
const user_avatar_key = 'user_avatar_' + constant.version;
const token_key = 'token_' + constant.version;
const delivery_key = 'delivery_' + constant.version;
const product_key = 'product_' + constant.version;
const cart_key = 'cart_' + constant.version;
const member_level_key = 'member_level_' + constant.version;
const scene_qrcode_key = 'scene_qrcode_' + constant.version;

const database = {
  getWeChatOpenId() {
    let wechat_open_id = localStorage.getItem(wechat_open_id_key);

    if (wechat_open_id == null) {
      wechat_open_id = '';
    }

    return wechat_open_id;
  },
  setWeChatOpenId(wechat_open_id) {
    localStorage.removeItem(wechat_open_id_key);

    localStorage.setItem(wechat_open_id_key, wechat_open_id);
  },
  removeWeChatOpenId() {
    localStorage.removeItem(wechat_open_id_key);
  },
  getUserName() {
    let user_name = localStorage.getItem(user_name_key);

    if (user_name == null) {
      user_name = '';
    }

    return user_name;
  },
  removeWeChatOpenId() {
    localStorage.removeItem(wechat_open_id_key);
  },
  setUserAvatar(user_avatar) {
    localStorage.removeItem(user_avatar_key);

    localStorage.setItem(user_avatar_key, user_avatar);
  },
  getUserAvatar() {
    let user_avatar = localStorage.getItem(user_avatar_key);

    if (user_avatar == null) {
      user_avatar = '';
    }

    return user_avatar;
  },
  setUserName(user_name) {
    localStorage.removeItem(user_name_key);

    localStorage.setItem(user_name_key, user_name);
  },
  getToken() {
    let token = localStorage.getItem(token_key);

    if (token == null) {
      token = '';
    }

    return token;
  },
  setToken(token) {
    localStorage.removeItem(token_key);

    localStorage.setItem(token_key, token);
  },
  removeToken() {
    localStorage.removeItem(token_key);
  },
  getDelivery() {
    let delivery = localStorage.getItem(delivery_key);

    if (delivery == null) {
      return {};
    }

    return JSON.parse(delivery);
  },
  setDelivery(delivery) {
    localStorage.removeItem(delivery_key);

    localStorage.setItem(delivery_key, JSON.stringify(delivery));
  },
  removeDelivery() {
    localStorage.removeItem(delivery_key);
  },
  getProduct() {
    let product = localStorage.getItem(product_key);

    if (product == null) {
      return [];
    }

    return JSON.parse(product);
  },
  setProduct(product) {
    localStorage.removeItem(product_key);

    localStorage.setItem(product_key, JSON.stringify(product));
  },
  removeProduct() {
    localStorage.removeItem(product_key);
  },
  getCartList() {
    let cart = localStorage.getItem(cart_key);

    if (cart == null) {
      return [];
    }

    return JSON.parse(cart);
  },
  setCartList(cartList) {
    localStorage.removeItem(cart_key);

    localStorage.setItem(cart_key, JSON.stringify(cartList));
  },
  addCart(cart) {
    let cartList = this.getCartList();
    let isNotExit = true;

    for (let i = 0; i < cartList.length; i++) {
      let c = cartList[i];

      if (cart.product_id == c.product_id) {
        isNotExit = false;

        c.product_name = cart.product_name;
        c.product_image = cart.product_image;
        c.product_price = cart.product_price;
        c.product_quantity = cart.product_quantity + c.product_quantity;
        c.sku_id = cart.sku_id;
      }
    }

    if (isNotExit) {
      cartList.push(cart);
    }

    localStorage.removeItem(cart_key);

    localStorage.setItem(cart_key, JSON.stringify(cartList));
  },
  removeCart() {
    localStorage.removeItem(cart_key);
  },
  getMemberLevel() {
    let member_level = localStorage.getItem(member_level_key);

    if (member_level == null) {
      return {
        member_level_id: '',
        member_level_name: '',
        member_level_value: -1
      };
    }

    return JSON.parse(member_level);
  },
  setMemberLevel(member_level) {
    localStorage.removeItem(member_level_key);

    localStorage.setItem(member_level_key, JSON.stringify(member_level));
  },
  removeMemberLevel() {
    localStorage.removeItem(member_level_key);
  },
  getSceneQrcode() {
    let scene_qrcode = localStorage.getItem(scene_qrcode_key);

    if (scene_qrcode == null) {
      scene_qrcode = ''
    }

    return scene_qrcode;
  },
  setSceneQrcode(scene_qrcode) {
    localStorage.removeItem(scene_qrcode_key);

    localStorage.setItem(scene_qrcode_key, scene_qrcode);
  },
  removeSceneQrcode() {
    localStorage.removeItem(scene_qrcode_key);
  },
  removeAll() {
    localStorage.clear();
  }
};

export default database;
