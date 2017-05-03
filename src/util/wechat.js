import http from './http';
import database from './database';

const wechat = {
  auth() {
    let wechat_open_id = this.getQueryString('wechat_open_id');

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
          wechat_open_id: wechat_open_id
        },
        success: function (data) {
          database.setWeChatOpenId(wechat_open_id);
          database.setToken(data.token);
          database.setDelivery(data.delivery);
          database.setUserName(data.user_name);
          database.setUserAvatar(data.user_avatar);
          database.setMemberLevel(data.member_level);
          database.setSceneQrcode(data.scene_qrcode);
        }.bind(this),
        complete: function () {

        }.bind(this)
      }).post();
    }
  },
  login() {
    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx26c8db6f1987e4e0&redirect_uri=http://api.jiyiguan.nowui.com/wechat/api/auth?url=" + document.URL.replace('http://h5.jiyiguan.nowui.com/#/', '') + "&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
  },
  getQueryString(name) {
    let url = document.location.href;
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = url.substr(url.indexOf("?") + 1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return '';
  },
  pay() {

  }
};

export default wechat;
