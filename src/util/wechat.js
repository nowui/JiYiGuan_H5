import http from './http';
import database from './database';

const wechat = {
  auth() {
    const wechat_open_id = this.getQueryString('wechat_open_id');

    // if (wechat_open_id == '') {
    //     let ua = navigator.userAgent.toLowerCase();
    //     if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //         if (database.getToken() == '') {
    //             this.login();
    //         }
    //     }
    // }


    if (wechat_open_id != '') {
      http({
        url: '/member/wechat/login',
        data: {
          wechat_open_id,
        },
        success(data) {
          database.setWeChatOpenId(wechat_open_id);
          database.setToken(data.token);
          database.setDelivery(data.delivery);
          database.setUserName(data.user_name);
          database.setUserAvatar(data.user_avatar);
          database.setMemberLevel(data.member_level);
          database.setSceneQrcode(data.scene_qrcode);
        },
        complete() {

        },
      }).post();
    }
  },
  login() {
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx26c8db6f1987e4e0&redirect_uri=http://api.jiyiguan.nowui.com/wechat/api/auth?url=${document.URL.replace('http://h5.jiyiguan.nowui.com/#/', '')}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
  },
  getQueryString(name) {
    const url = document.location.href;
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    const r = url.substr(url.indexOf('?') + 1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return '';
  },
  pay() {

  },
};

export default wechat;
