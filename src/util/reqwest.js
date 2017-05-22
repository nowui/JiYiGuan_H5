import {Toast} from 'antd-mobile';
import reqwest from 'reqwest';

import constant from './constant';
import storage from './storage';

function ajax(config) {
  if (typeof(config.is_toast) == 'undefined') {
    config.is_toast = true;
  }

  if (config.is_toast) {
    Toast.loading('加载中..', 0);
  }

  reqwest({
    url: constant.host + config.url,
    type: 'json',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Token': storage.getToken(),
      'Platform': constant.platform,
      'Version': constant.version,
    },
    data: JSON.stringify(config.data),
    success: function (response) {
      if (config.is_toast) {
        Toast.hide();
      }

      if (response.code == 200) {
        config.success(response.data);
      } else {
        Toast.fail(response.message, constant.duration);
      }
    },
    fail: function () {
      if (config.is_toast) {
        Toast.hide();
      }

      Toast.fail(constant.error, constant.duration);
    }
  });
}

module.exports = {
  ajax: ajax
};
