import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {createForm} from 'rc-form';

import {Toast, NavBar, WhiteSpace, List, TextareaItem, Popup, Modal} from 'antd-mobile';

import Login from './Login';

import constant from '../util/constant';
import database from '../util/database';
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
        delivery_address: ''
      },
      product_list: [],
      productTotal: 0,
      freight: 0,
      total: 0
    }

  }

  componentDidMount() {
    this.handleReset();

    http({
      url: '/order/check',
      data: {
        product_list: []
      },
      success: function (data) {
        let is_pay = true;
        let is_delivery = false;
        let product_list = database.getProduct();
        let freight = 0;
        let total = 0;

        if (data.delivery_name == '') {
          is_pay = false;

          alert('提示', '您还没有收货地址，是否新建一个？', [
            {
              text: '取消',
              onPress: function () {

              }
            },
            {
              text: '确定',
              onPress: function () {
                this.props.dispatch(routerRedux.push({
                  pathname: '/delivery/index/order_check_' + this.props.params.type,
                  query: {}
                }));
              }.bind(this)
            },
          ]);
        } else {
          is_delivery = true;
        }

        let delivery = {
          delivery_name: data.delivery_name,
          delivery_phone: data.delivery_phone,
          delivery_address: data.delivery_address
        }

        for (let i = 0; i < product_list.length; i++) {
          let product = product_list[i];

          let product_total_price = product.product_quantity * product.product_price[0].product_price;

          product.product_total_price = product_total_price.toFixed(2);
          total += product_total_price;
        }

        if (!total > 0) {
          is_pay = false;
        }

        this.setState({
          is_pay: is_pay,
          is_delivery: is_delivery,
          delivery: delivery,
          product_list: product_list,
          freight: new Number(freight).toFixed(2),
          total: total.toFixed(2)
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  componentWillUnmount() {
    Popup.hide();
  }

  handleReset() {
    let productTotal = 0;
    for (let i = 0; i < this.state.product_list.length; i++) {
      productTotal += this.state.product_list[i].product_price[0].product_price * this.state.product_list[i].product_quantity;
    }

    this.setState({
      delivery: database.getDelivery(),
      productTotal: productTotal,
      total: productTotal + this.state.freight
    });
  }

  handleBack() {
    if (this.props.params.type.indexOf('product_') > -1) {
      let url = this.props.params.type.replace('product_detail_', 'product/detail/');
      let index = url.lastIndexOf('_');

      this.props.dispatch(routerRedux.push({
        pathname: '/' + url.substring(0, index) + '/' + url.substring(index + 1, url.length),
        query: {}
      }));
    }

    if (this.props.params.type.indexOf('cart') > -1) {
      this.props.dispatch(routerRedux.push({
        pathname: '/cart',
        query: {}
      }));
    }
  }

  handleLoginSucess() {
    this.handleReset();
  }

  handleDelivery() {
    if (database.getToken() == '') {
      Popup.show(<Login type='PRODUCT' data={''} handleLoginSucess={this.handleLoginSucess.bind(this)}/>, {
        animationType: 'slide-up',
        maskClosable: false
      });
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: '/delivery/index/order_check_' + this.props.params.type,
        query: {}
      }));
    }
  }

  handlePay() {
    if (!this.state.is_pay) {
      return;
    }


    if (database.getToken() == '') {
      Popup.show(<Login type='PRODUCT' data={''} handleLoginSucess={this.handleLoginSucess.bind(this)}/>, {
        animationType: 'slide-up',
        maskClosable: false
      });

      return;
    }

    if (typeof (this.state.delivery.delivery_name) == 'undefined') {
      Toast.fail('请选择收货地址', constant.duration);

      return;
    }

    let product_list = [];

    for (let i = 0; i < this.state.product_list.length; i++) {
      product_list.push({
        sku_id: this.state.product_list[i].sku_id,
        product_quantity: this.state.product_list[i].product_quantity
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
        product_list: product_list,
        open_id: database.getWeChatOpenId(),
        pay_type: 'H5'
      },
      success: function (data) {
        if (typeof WeixinJSBridge == "undefined") {
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
      complete: function () {

      }.bind(this)
    }).post();
  }

  onBridgeReady(data) {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        "appId": data.appId,
        "timeStamp": data.timeStamp,
        "nonceStr": data.nonceStr,
        "package": data.package,
        "signType": data.signType,
        "paySign": data.paySign
      },
      function (res) {
        database.setProduct([]);

        if (res.err_msg == "get_brand_wcpay_request:ok") {
          this.props.dispatch(routerRedux.push({
            pathname: '/order/result/check/' + data.orderId,
            query: {}
          }));
        } else {
          this.props.dispatch(routerRedux.push({
            pathname: '/order/detail/ALL/' + data.orderId,
            query: {}
          }));
        }
      }.bind(this)
    );
  }

  render() {
    const Item = List.Item;
    const {getFieldProps} = this.props.form;

    return (
      <div>
        <NavBar className={style.header} mode="light" leftContent="返回"
                onLeftClick={this.handleBack.bind(this)}>填写订单</NavBar>
        <div className={style.page}>
          <WhiteSpace size="lg"/>
          <List>
            <Item arrow="horizontal" wrap onClick={this.handleDelivery.bind(this)}>
              {
                typeof (this.state.delivery.delivery_name) == 'undefined' ?
                  '收货地址'
                  :
                  <div>
                    <div>{this.state.delivery.delivery_name} {this.state.delivery.delivery_phone}</div>
                    <div className={style.deliveryAddress}>{this.state.delivery.delivery_address}</div>
                  </div>
              }
            </Item>
          </List>
          <WhiteSpace size="lg"/>
          <List>
            {
              this.state.product_list.map(function (item) {
                return (
                  <Item key={item.product_id}
                        extra={'￥' + (item.product_quantity * item.product_price[0].product_price).toFixed(2)}>
                    <img className={style.productListImage}
                         src={constant.host + item.product_image}/>
                    <div className={style.productListText}>
                      {item.product_name}
                      <div>× {item.product_quantity}</div>
                    </div>
                  </Item>
                )
              }.bind(this))
            }
          </List>
          <WhiteSpace size="lg"/>
          <List>
            <Item extra={'￥' + this.state.productTotal.toFixed(2)}>
              商品金额
            </Item>
            <Item extra={'￥' + this.state.freight}>
              运费
            </Item>
          </List>

          <WhiteSpace size="lg"/>
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
          <div className={style.checkSubmit} style={{backgroundColor: this.state.is_pay ? '#1AAD19' : '#dddddd'}}
               onClick={this.handlePay.bind(this)}>立刻支付
          </div>
        </div>
      </div>
    );
  }
}

OrderCheck.propTypes = {};

OrderCheck = createForm()(OrderCheck);

export default connect(({}) => ({}))(OrderCheck);
