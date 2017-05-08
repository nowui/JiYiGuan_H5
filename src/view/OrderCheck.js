import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';

import { Toast, NavBar, WhiteSpace, List, TextareaItem, Modal } from 'antd-mobile';

import constant from '../util/constant';
import storage from '../util/storage';
import http from '../util/http';

import style from './style.css';

const alert = Modal.alert;

class OrderCheck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_pay: false,
      is_delivery: false,
      delivery: {
        delivery_name: '',
        delivery_phone: '',
        delivery_address: '',
      },
      product_list: [],
      product_total: 0,
      freight: 0,
      total: 0,
    };
  }

  componentDidMount() {
    http({
      url: '/order/check',
      data: {
        product_list: [],
      },
      success: function (data) {
        var is_pay = true;
        var is_delivery = false;
        var product_list = storage.getProduct();
        var product_total = 0;
        var freight = data.freight;
        var total = 0;

        if (data.delivery_name == '') {
          is_pay = false;

          alert('提示', '您还没有收货地址，是否新建一个？', [
            {
              text: '取消',
              onPress() {

              },
            },
            {
              text: '确定',
              onPress: function () {
                this.props.dispatch(routerRedux.push({
                  pathname: `/delivery/index/order_check_${this.props.params.type}`,
                  query: {},
                }));
              }.bind(this),
            },
          ]);
        } else {
          is_delivery = true;
        }

        const delivery = {
          delivery_name: data.delivery_name,
          delivery_phone: data.delivery_phone,
          delivery_address: data.delivery_address,
        };

        for (var i = 0; i < product_list.length; i++) {
          const product = product_list[i];

          product_total += product.product_quantity * product.product_price[0].product_price;

          product.product_total_price = product_total_price.toFixed(2);
        }

        total = product_total + freight;

        if (!product_total > 0) {
          is_pay = false;
        }

        this.setState({
          is_pay,
          is_delivery,
          delivery,
          product_list,
          product_total: product_total.toFixed(2),
          freight: new Number(freight).toFixed(2),
          total: total.toFixed(2),
        });
      }.bind(this),
      complete() {

      },
    }).post();
  }

  componentWillUnmount() {

  }

  handleBack() {
    if (this.props.params.type.indexOf('product_') > -1) {
      const url = this.props.params.type.replace('product_detail_', 'product/detail/');
      const index = url.lastIndexOf('_');

      this.props.dispatch(routerRedux.push({
        pathname: `/${url.substring(0, index)}/${url.substring(index + 1, url.length)}`,
        query: {},
      }));
    }

    if (this.props.params.type.indexOf('cart') > -1) {
      this.props.dispatch(routerRedux.push({
        pathname: '/cart',
        query: {},
      }));
    }
  }

  handleDelivery() {
    this.props.dispatch(routerRedux.push({
      pathname: `/delivery/index/order_check_${this.props.params.type}`,
      query: {},
    }));
  }

  handlePay() {
    if (!this.state.is_pay) {
      return;
    }

    if (typeof (this.state.delivery.delivery_name) === 'undefined') {
      Toast.fail('请选择收货地址', constant.duration);

      return;
    }

    const product_list = [];

    for (var i = 0; i < this.state.product_list.length; i++) {
      product_list.push({
        sku_id: this.state.product_list[i].sku_id,
        product_quantity: this.state.product_list[i].product_quantity,
      });
    }

    if (product_list.length == 0) {
      Toast.fail('请选购商品', constant.duration);
    }

    http({
      url: '/order/save',
      data: {
        order_delivery_name: this.state.delivery.delivery_name,
        order_delivery_phone: this.state.delivery.delivery_phone,
        order_delivery_address: this.state.delivery.delivery_address,
        order_message: this.props.form.getFieldValue('order_message'),
        order_pay_type: 'WECHAT_PAY',
        product_list,
        open_id: storage.getOpenId(),
        pay_type: 'H5',
      },
      success: function (data) {
        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(data), false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(data));
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(data));
          }
        } else {
          this.onBridgeReady(data);
        }
      }.bind(this),
      complete() {

      },
    }).post();
  }

  onBridgeReady(data) {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        appId: data.appId,
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
      },
      (res) => {
        storage.setProduct([]);

        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          this.props.dispatch(routerRedux.push({
            pathname: `/order/result/check/${data.orderId}`,
            query: {},
          }));
        } else {
          this.props.dispatch(routerRedux.push({
            pathname: `/order/detail/ALL/${data.orderId}`,
            query: {},
          }));
        }
      },
    );
  }

  render() {
    const Item = List.Item;
    const { getFieldProps } = this.props.form;

    return (
      <div>
        <NavBar
          className={style.header} mode="light" leftContent="返回"
          onLeftClick={this.handleBack.bind(this)}
        >填写订单</NavBar>
        <div className={style.page}>
          <WhiteSpace size="lg" />
          <List>
            <Item arrow="horizontal" wrap onClick={this.handleDelivery.bind(this)}>
              {
                typeof (this.state.delivery.delivery_name) === 'undefined' ?
                  '收货地址'
                  :
                  <div>
                    <div>{this.state.delivery.delivery_name} {this.state.delivery.delivery_phone}</div>
                    <div className={style.deliveryAddress}>{this.state.delivery.delivery_address}</div>
                  </div>
              }
            </Item>
          </List>
          <WhiteSpace size="lg" />
          <List>
            {
              this.state.product_list.map((item) => {
                return (
                  <Item
                    key={item.product_id}
                    extra={`￥${(item.product_quantity * item.product_price[0].product_price).toFixed(2)}`}
                  >
                    <img
                      className={style.productListImage}
                      src={constant.host + item.product_image_file}
                    />
                    <div className={style.productListText}>
                      {item.product_name}
                      <div>× {item.product_quantity}</div>
                    </div>
                  </Item>
                );
              })
            }
          </List>
          <WhiteSpace size="lg" />
          <List>
            <Item extra={`￥${this.state.product_total.toFixed(2)}`}>
              商品金额
            </Item>
            <Item extra={`￥${this.state.freight}`}>
              运费
            </Item>
          </List>

          <WhiteSpace size="lg" />
          <List>
            <TextareaItem
              {...getFieldProps('order_message', {
                initialValue: '',
              })}
              placeholder="请输入买家留言"
              rows={3}
              count={100}
            />
          </List>
        </div>
        <div className={style.footer}>
          <div className={style.checkTotal}>
            <span className={style.checkTotalText}>实付总金额: ￥{this.state.total}</span>
          </div>
          <div
            className={style.checkSubmit} style={{ backgroundColor: this.state.is_pay ? '#1AAD19' : '#dddddd' }}
            onClick={this.handlePay.bind(this)}
          >立刻支付
          </div>
        </div>
      </div>
    );
  }
}

OrderCheck.propTypes = {};

OrderCheck = createForm()(OrderCheck);

export default connect(({}) => ({}))(OrderCheck);
