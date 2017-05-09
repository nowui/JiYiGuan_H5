import constant from '../util/constant';

const open_id_key = ('open_id_' + constant.version);
const token_key = ('token_' + constant.version);
const product_key = ('product_' + constant.version);
const cart_key = ('cart_' + constant.version);
const delivery_key = ('delivery_' + constant.version);
const member_key = ('member_' + constant.version);

function getOpenId() {
  return localStorage.getItem(open_id_key);
}

function setOpenId(open_id) {
  localStorage.setItem(open_id_key, open_id);
}


function getToken() {
  var token = localStorage.getItem(token_key);

  if (token == null) {
    if (constant.is_developer) {
      return 'eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE0OTQyNTc2ODQsImV4cCI6MTUyNTc5MzY4NCwiYXV0aG9yaXphdGlvbl9pZCI6IjA0NTI4MTAyZDMwODQwZGFhNWUyYWMzZTg4ODM2N2U5IiwidXNlcl9pZCI6Ijk4Yjc3OGIxMTc1MDRjOTg4MWIzOGQ5OTE0ZDdmOTZkIn0.hSlb0WMcz3wWSBMOOUm8krupBSZ6VEYNiGAFZP04vUuEuCqNEoEJNsNJn7FprODyoqFl8Skv-315_3EFEbu1iA';
    } else {
      return '';
    }
  }

  return token;
}

function setToken(token) {
  localStorage.clear();

  localStorage.setItem(token_key, token);
}

function getProduct() {
  var product = localStorage.getItem(product_key);

  if (product == null) {
    return [];
  }

  return JSON.parse(product);
}

function setProduct(product) {
  localStorage.setItem(product_key, JSON.stringify(product));
}

function removeProduct() {
  wx.removeStorageSync(product_key);
}

function getCart() {
  var cart = localStorage.getItem(cart_key);

  if (cart == null) {
    return [];
  }

  return JSON.parse(cart);
}

function setCart(cart) {
  localStorage.setItem(cart_key, JSON.stringify(cart));
}

function addCart(product) {
  var cartList = getCart();
  var isNotExit = true;

  for (var i = 0; i < cartList.length; i++) {
    var cart = cartList[i];

    if (cart.product_id == product.product_id) {
      isNotExit = false;

      cart.sku_id = product.sku_id;
      cart.product_name = product.product_name;
      cart.product_image = product.product_image;
      cart.product_price = product.product_price;
      cart.product_quantity.quantity = product.product_quantity.quantity + cart.product_quantity.quantity;
      cart.product_stock = product.product_stock;
    }
  }

  if (isNotExit) {
    cartList.push(product);
  }

  localStorage.setItem(cart_key, JSON.stringify(cartList));
}

function removeCart() {
  wx.removeStorageSync(cart_key);
}

function getDelivery() {
  var delivery = localStorage.getItem(delivery_key);

  if (delivery == null) {
    return {
      delivery_name: '',
      delivery_phone: '',
      delivery_address: ''
    };
  }

  return JSON.parse(delivery);
}

function setDelivery(delivery) {
  localStorage.setItem(delivery_key, JSON.stringify(delivery));
}

function removeDelivery() {
  wx.removeStorageSync(delivery_key);
}

function getMember() {
  var member = localStorage.getItem(member_key);

  if (member == null) {
    if (constant.is_developer) {
      return {
        "user_name": "Ronaldo",
        "user_avatar": "http://wx.qlogo.cn/mmopen/9FxxcxLpKVsTsPshsySRq7W5TDVr6dticxqKribaEGFfUthzxoRrbknym1beVH9mlE5MQtK1KqlyznRxMRpder6w7aEUXI5pEW/0",
        "member_level_id": "675437f6b82e437d9c577a30d42516e9",
        "member_level_value": "1"
      };
    } else {
      return {
        user_name: '',
        user_avatar: '',
        member_level_id: '',
        member_level_value: 999
      };
    }
  }

  return JSON.parse(member);
}

function setMember(member) {
  localStorage.setItem(member_key, JSON.stringify(member));
}

module.exports = {
  getOpenId: getOpenId,
  setOpenId: setOpenId,
  getToken: getToken,
  setToken: setToken,
  getProduct: getProduct,
  setProduct: setProduct,
  removeProduct: removeProduct,
  getCart: getCart,
  setCart: setCart,
  addCart: addCart,
  removeCart: removeCart,
  getDelivery: getDelivery,
  setDelivery: setDelivery,
  removeDelivery: removeDelivery,
  getMember: getMember,
  setMember: setMember
};
