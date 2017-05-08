import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, WhiteSpace, List, Badge} from 'antd-mobile';

import storage from '../util/storage';
import http from '../util/http';

import style from './style.css';

class My extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http({
      is_toast: false,
      url: '/member/my/find',
      data: {},
      success: function (data) {
        this.props.dispatch({
          type: 'my/fetch',
          data: {
            member_total_amount: data.member_total_amount,
            WAIT_PAY: data.WAIT_PAY,
            WAIT_SEND: data.WAIT_SEND,
            WAIT_RECEIVE: data.WAIT_RECEIVE,
          },
        });
      }.bind(this),
      complete() {

      },
    }).post();
  }

  handleBill() {
    this.props.dispatch(routerRedux.push({
      pathname: '/bill/index',
      query: {},
    }));
  }

  handleOrder(order_status) {
    this.props.dispatch(routerRedux.push({
      pathname: '/order/index/' + order_status,
      query: {},
    }));
  }

  handleDelivery() {
    this.props.dispatch(routerRedux.push({
      pathname: '/delivery/index/list',
      query: {},
    }));
  }

  handleFavor() {
    this.props.dispatch(routerRedux.push({
      pathname: '/favor/index',
      query: {},
    }));
  }

  handleQrcode() {
    this.props.dispatch(routerRedux.push({
      pathname: '/qrcode',
      query: {},
    }));
  }

  handleTeam() {
    this.props.dispatch(routerRedux.push({
      pathname: '/team/index',
      query: {},
    }));
  }

  render() {
    const Item = List.Item;

    return (
      <div>
        <NavBar className={style.header} mode="light" iconName={false}>个人中心</NavBar>
        <div className={style.page2}>
          <WhiteSpace size="lg"/>
          <List>
            <Item
              onClick={this.handleBill.bind(this)}
              extra="账单"
              arrow="horizontal"
            >
              <div className={style.avatar}>
                <img src={storage.getMember().user_avatar} style={{width: '100%', height: '100%'}}/>
              </div>
              <div className={style.name}>{storage.getMember().user_name}</div>
              <div className={style.totalAmount}>
                账户余额：<span className={style.money}>￥{this.props.my.member_total_amount.toFixed(2)}</span>
              </div>
            </Item>
          </List>
          <WhiteSpace size="lg"/>
          <List>
            <Item
              thumb={require('../assets/svg/form.svg')}
              extra="查看全部订单" arrow="horizontal"
              onClick={this.handleOrder.bind(this, 'ALL')}
            >
              我的订单
            </Item>
            <Item style={{paddingLeft: '60px'}}>
              <div className={style.mineOrderItem} onClick={this.handleOrder.bind(this, 'WAIT_PAY')}>
                <Badge text={this.props.my.WAIT_PAY}>
                  <img src={require('../assets/svg/pay.svg')}/>
                </Badge>
                <div className={style.mineOrderItemText}>待付款</div>
              </div>
              <div className={style.mineOrderItem} onClick={this.handleOrder.bind(this, 'WAIT_SEND')}>
                <Badge text={this.props.my.WAIT_SEND}>
                  <img src={require('../assets/svg/send.svg')}/>
                </Badge>
                <div className={style.mineOrderItemText}>待发货</div>
              </div>
              <div className={style.mineOrderItem} onClick={this.handleOrder.bind(this, 'WAIT_RECEIVE')}>
                <Badge text={this.props.my.WAIT_RECEIVE}>
                  <img src={require('../assets/svg/deliver.svg')}/>
                </Badge>
                <div className={style.mineOrderItemText}>待收货</div>
              </div>
              <div className={style.mineOrderItem} onClick={this.handleOrder.bind(this, 'FINISH')}>
                <img src={require('../assets/svg/comment.svg')}/>
                <div className={style.mineOrderItemText}>已完成</div>
              </div>
            </Item>
          </List>
          {
            storage.getMember().member_level_value < 3 ?
              <WhiteSpace size="lg"/>
              :
              ''
          }
          {
            storage.getMember().member_level_value < 3 ?
              <List>
                <Item
                  thumb={require('../assets/svg/qr_code.svg')} arrow="horizontal"
                  onClick={this.handleQrcode.bind(this)}
                >
                  我的二维码
                </Item>
                <Item
                  thumb={require('../assets/svg/friend.svg')} arrow="horizontal"
                  onClick={this.handleTeam.bind(this)}
                >
                  我的团队
                </Item>
              </List>
              :
              ''
          }
          <WhiteSpace size="lg"/>
          <List>
            <Item
              thumb={require('../assets/svg/location.svg')} arrow="horizontal"
              onClick={this.handleDelivery.bind(this)}
            >
              我的地址
            </Item>
            <Item
              thumb={require('../assets/svg/favor_active.svg')} arrow="horizontal"
              onClick={this.handleFavor.bind(this)}
            >
              我的收藏
            </Item>
          </List>
        </div>
      </div>
    );
  }
}

My.propTypes = {};

export default connect(({my}) => ({my}))(My);
