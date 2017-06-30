import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {WhiteSpace, List} from 'antd-mobile';

import http from '../util/http';
import style from './style.css';

class BillIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_list: false
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'main/fetch',
      data: {
        title: '我的账单'
      },
    });

    document.body.scrollTop = 0;

    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http.request({
      url: '/bill/list',
      data: {
        page_index: 0,
        page_size: 0
      },
      success: function (data) {
        this.props.dispatch({
          type: 'bill/fetch',
          data: {
            member_withdraw_amount: data.member_withdraw_amount,
            member_commission_amount: data.member_commission_amount,
            member_order_amount: data.member_order_amount,
            bill_list: data.bill_list
          }
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: true
        });
      }.bind(this)
    });
  }

  handleBack() {
    this.props.dispatch(routerRedux.push({
      pathname: '/my',
      query: {}
    }));
  }

  handleClick(bill_id) {

  }

  handleMoney() {

  }

  render() {
    const Item = List.Item;
    const Brief = Item.Brief;

    return (
      <div>
        {/*<NavBar className={style.header} mode="light" leftContent="返回"*/}
        {/*onLeftClick={this.handleBack.bind(this)}*/}
        {/*>我的账单</NavBar>*/}
        <div className={style.header2} style={{backgroundColor: '#ffffff'}}>
          <div style={{margin: '30px 0px 30px 0px'}}>
            <div style={{float: 'left', width: '33%'}}>
              <div style={{marginLeft: '20px'}}>
                <div style={{marginLeft: '5px'}}>可提现</div>
                <div>￥{this.props.bill.member_withdraw_amount.toFixed(2)}</div>
              </div>
            </div>
            <div style={{float: 'left', width: '33%', borderLeft: '1px solid #ddd'}}>
              <div style={{marginLeft: '20px'}}>
                <div style={{marginLeft: '5px'}}>总收入</div>
                <div>￥{this.props.bill.member_commission_amount.toFixed(2)}</div>
              </div>
            </div>
            <div style={{float: 'left', width: '33%', borderLeft: '1px solid #ddd'}}>
              <div style={{marginLeft: '20px'}}>
                <div style={{marginLeft: '5px'}}>总进货</div>
                <div>￥{this.props.bill.member_order_amount.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.page4}>
          <WhiteSpace size="lg"/>
          {
            this.props.bill.bill_list.length > 0 ?
              <List>
                {
                  this.props.bill.bill_list.map(function (item) {
                    return (
                      <Item key={item.bill_id} onClick={this.handleClick.bind(this, item.bill_id)}
                            extra={(item.bill_is_income ? '+' : '-') + '￥' + item.bill_amount.toFixed(2)}>
                        {
                          item.bill_type == 'ORDER' ? '进货' : ''
                        }
                        {
                          item.bill_type == 'COMMISSION' ? '收入' : ''
                        }
                      </Item>
                    )
                  }.bind(this))
                }
              </List>
              :
              ''
          }
          {
            this.state.is_load && this.props.bill.bill_list.length == 0 ?
              <view className={style.noData}>
                <img src={require('../assets/svg/empty.svg')} className={style.noDataImageIcon}></img>
                <view className={style.noDataText}>当前没有数据</view>
              </view>
              :
              ''
          }
        </div>
        <div className={style.footer}>
          <div className={style.footerButtom} onClick={this.handleMoney.bind(this)}>我要提现</div>
        </div>
      </div>
    );
  }
}

BillIndex.propTypes = {};

export default connect(({bill}) => ({bill}))(BillIndex);
