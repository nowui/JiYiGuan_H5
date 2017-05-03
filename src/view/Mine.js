import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {Toast, NavBar, WhiteSpace, List, Button, Popup} from 'antd-mobile';

import Login from './Login';

import constant from '../util/constant';
import database from '../util/database';

import style from './style.css';

class Mine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_login: database.getToken() != ''
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleMine() {
    if (database.getToken() == '') {
      Popup.show(<Login type='PRODUCT' data={''} handleLoginSucess={this.handleLoginSucess.bind(this)}/>, {
        animationType: 'slide-up',
        maskClosable: false
      });
    } else {
      if (database.getMemberLevel().member_level_value < 3) {
        this.props.dispatch(routerRedux.push({
          pathname: '/qrcode',
          query: {}
        }));
      }
    }
  }

  handleOrder(order_status) {
    if (database.getToken() == '') {
      Popup.show(<Login type='PRODUCT' data={''} handleLoginSucess={this.handleLoginSucess.bind(this)}/>, {
        animationType: 'slide-up',
        maskClosable: false
      });
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: '/order/index/' + order_status,
        query: {}
      }));
    }
  }

  handleDelivery() {
    if (database.getToken() == '') {
      Popup.show(<Login type='PRODUCT' data={''} handleLoginSucess={this.handleLoginSucess.bind(this)}/>, {
        animationType: 'slide-up',
        maskClosable: false
      });
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: '/delivery/index/list',
        query: {}
      }));
    }
  }

  handleFavor() {
    if (database.getToken() == '') {
      Popup.show(<Login type='PRODUCT' data={''} handleLoginSucess={this.handleLoginSucess.bind(this)}/>, {
        animationType: 'slide-up',
        maskClosable: false
      });
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: '/favor/index',
        query: {}
      }));
    }
  }

  handleTeam() {
    if (database.getToken() == '') {
      Popup.show(<Login type='PRODUCT' data={''} handleLoginSucess={this.handleLoginSucess.bind(this)}/>, {
        animationType: 'slide-up',
        maskClosable: false
      });
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: '/team/index',
        query: {}
      }));
    }
  }

  handleBill() {
    if (database.getToken() == '') {
      Popup.show(<Login type='PRODUCT' data={''} handleLoginSucess={this.handleLoginSucess.bind(this)}/>, {
        animationType: 'slide-up',
        maskClosable: false
      });
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: '/bill/index',
        query: {}
      }));
    }
  }

  handleLogout() {
    database.removeWeChatOpenId();
    database.removeToken();
    database.removeDelivery();

    this.setState({
      is_login: false
    });

    Toast.success('退出成功', constant.duration);
  }

  handleLoginSucess() {
    this.setState({
      is_login: true
    });
  }

  render() {
    const Item = List.Item;

    return (
      <div>
        <NavBar className={style.header} mode="light" iconName={false}>个人中心</NavBar>
        <div className={style.page}>
          <WhiteSpace size="lg"/>
          <List>
            <Item onClick={this.handleMine.bind(this)}
                  extra={database.getMemberLevel().member_level_value < 3 ? '二维码' : ''}
                  arrow={database.getMemberLevel().member_level_value < 3 ? 'horizontal' : ''}>
              {
                this.state.is_login ?
                  <div className={style.avatar}>
                    <img src={database.getUserAvatar()} style={{width: '100%', height: '100%'}}/>
                  </div>
                  :
                  '请登录平台'
              }
              {
                this.state.is_login ?
                  <div className={style.name}>{database.getUserName()}</div>
                  :
                  ''
              }
              {
                this.state.is_login ?
                  <div className={style.clazz}></div>
                  :
                  ''
              }
            </Item>
          </List>
          <WhiteSpace size="lg"/>
          <List>
            <Item extra="查看全部订单" arrow="horizontal"
                  onClick={this.handleOrder.bind(this, "ALL")}>
              我的订单
            </Item>
            <Item>
              <div className={style.mineOrderItem} onClick={this.handleOrder.bind(this, "WAIT_PAY")}>
                <img src={require('../assets/svg/pay.svg')}/>
                <div className={style.mineOrderItemText}>待付款</div>
              </div>
              <div className={style.mineOrderItem} onClick={this.handleOrder.bind(this, "WAIT_SEND")}>
                <img src={require('../assets/svg/send.svg')}/>
                <div className={style.mineOrderItemText}>待发货</div>
              </div>
              <div className={style.mineOrderItem} onClick={this.handleOrder.bind(this, "WAIT_RECEIVE")}>
                <img src={require('../assets/svg/deliver.svg')}/>
                <div className={style.mineOrderItemText}>待收货</div>
              </div>
              <div className={style.mineOrderItem} onClick={this.handleOrder.bind(this, "FINISH")}>
                <img src={require('../assets/svg/comment.svg')}/>
                <div className={style.mineOrderItemText}>已完成</div>
              </div>
            </Item>
          </List>
          <WhiteSpace size="lg"/>
          <List>
            {
              database.getMemberLevel().member_level_value < 3 ?
                <Item thumb={require('../assets/svg/friend.svg')} arrow="horizontal"
                      onClick={this.handleTeam.bind(this)}>
                  我的团队
                </Item>
                :
                ''
            }
            <Item thumb={require('../assets/svg/money_bag.svg')} arrow="horizontal"
                  onClick={this.handleBill.bind(this)}>
              我的账单
            </Item>
            <Item thumb={require('../assets/svg/location.svg')} arrow="horizontal"
                  onClick={this.handleDelivery.bind(this)}>
              我的地址
            </Item>
            <Item thumb={require('../assets/svg/favor_active.svg')} arrow="horizontal"
                  onClick={this.handleFavor.bind(this)}>
              我的收藏
            </Item>
          </List>
        </div>
      </div>
    );
  }
}

Mine.propTypes = {};

export default connect(({}) => ({}))(Mine);
