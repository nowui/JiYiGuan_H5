import constant from './constant';
import storage from './storage';

function getQueryString(name) {
  var url = document.location.href;
  var reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  var r = url.substr(url.indexOf('?') + 1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return '';
}

function auth() {
  var open_id = getQueryString('open_id');
  if (open_id == '') {
    var token = storage.getToken();
    if (token == '') {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx934f793803320ecd&redirect_uri=http%3A%2F%2Fapi.jiyiguan.nowui.com%2Fwechat%2Fapi%2Fauth%3Furl%3Dhome%26platform%3D' + constant.platform + '%26version%3D' + constant.version + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
    }
  } else {
    if (open_id != '') {
      var token = getQueryString('token');
      var user_name = getQueryString('user_name');
      var user_avatar = getQueryString('user_avatar');
      var member_level_id = getQueryString('member_level_id');
      var member_level_value = getQueryString('member_level_value');

      storage.setOpenId(open_id);
      storage.setToken(token);
    }
  }

}

export default {
  auth: auth
};
