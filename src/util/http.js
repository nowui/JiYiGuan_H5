import fetch from 'dva/fetch';
import {Toast} from 'antd-mobile';

import constant from './constant';
import database from './database';

const operation = (promise) => {
    let hasCanceled_ = false;
    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) =>
            hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
        );
        promise.catch((error) =>
            hasCanceled_ ? reject({isCanceled: true}) : reject(error)
        );
    });
    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};

export default function http(config) {
    const request = operation(fetch(constant.host + config.url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Token': database.getToken(),
            'Platform': constant.platform,
            'Version': constant.version
        },
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(config.data)
    }));

    return {
        post() {
            Toast.loading("加载中..", 0);

            request.promise.then(function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 200) {
                        Toast.hide();

                        config.success(json.data);
                    } else {
                        Toast.fail(json.message, constant.duration);
                    }

                    config.complete();
                });
            }).catch(function (error) {
                Toast.fail(constant.error, constant.duration);

                setTimeout(function () {
                    config.complete();
                }.bind(this), constant.timeout);
            });

            return request;
        },
        cancel() {
            request.cancel();
        },
    };
}
