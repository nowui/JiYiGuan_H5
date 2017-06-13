import reqwest from 'reqwest';
import {Toast} from 'antd-mobile';

import constant from './constant';
import storage from './storage';

function request(config) {
  if (typeof(config.is_toast) == 'undefined') {
    config.is_toast = true;
  }

  if (typeof(config.is_response) == 'undefined') {
    config.is_response = true;
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
      'Version': constant.version
    },
    data: JSON.stringify(config.data),
    success: function (response) {
      if (config.is_response) {
        if (response.code == 200) {
          if (config.is_toast) {
            Toast.hide();
          }

          config.success(response.data);
        } else {
          if (storage.getToken() != '') {
            Toast.fail(response.message, constant.duration);
          }
        }
      } else {
        config.success(response);
      }
    },
    error: function () {
      Toast.fail(constant.error, constant.duration);
    },
    complete: function () {
      config.complete();
    }
  });
}

module.exports = {
  request: request
};
