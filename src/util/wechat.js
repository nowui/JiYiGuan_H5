import constant from './constant';
import http from './http';
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

function share(imgUrl, title, desc, link) {
  if (imgUrl == '') {
    imgUrl = 'http://api.jiyiguan.nowui.com/upload/6a4dbae2ac824d2fb170638d55139666/b3ee3776d78f445e84b436c28224a63c.jpg';
  }
  if (title == '') {
    title = '广州市济颐馆贸易有限公司';
  }
  if (desc == '') {
    desc = '广州市济颐馆贸易有限公司是一家营销特殊营养保健产品的专业公司，主要服务对象为妇女儿童人群，亚健康人群，及术后康复人群。我公司通过搭建完善的健康服务平台，为消费者提供名医诊疗，保健咨询，体质调理等具有特色的健康综合服务。';
  }

  if (typeof(window.is_share) == 'undefined') {
    window.is_share = true;
  } else {
    window.share_config = {
      "share": {
        "imgUrl": imgUrl,
        "title": title,
        "desc": desc,
        "link": link,
        "success": function () {

        },
        'cancel': function () {

        }
      }
    };

    wx.onMenuShareAppMessage(share_config.share);
    wx.onMenuShareTimeline(share_config.share);
    wx.onMenuShareQQ(share_config.share);

    return;
  }

  http.request({
    is_toast: false,
    is_response: false,
    url: '/wechat/share?url=' + location.href,
    data: {

    },
    success: function (data) {
      wx.config({
        debug: false,
        appId: "wx934f793803320ecd",
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo'
        ]
      });

      window.share_config = {
        "share": {
          "imgUrl": imgUrl,
          "title": title,
          "desc": desc,
          "link": link,
          "success": function () {

          },
          'cancel': function () {

          }
        }
      };
      wx.ready(function () {
        wx.onMenuShareAppMessage(share_config.share);
        wx.onMenuShareTimeline(share_config.share);
        wx.onMenuShareQQ(share_config.share);
      });
    }.bind(this),
    complete: function () {

    }.bind(this),
  });
}

export default {
  auth: auth,
  share: share
};
