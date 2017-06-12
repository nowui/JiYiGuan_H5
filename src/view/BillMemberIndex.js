import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, WhiteSpace, List, Checkbox} from 'antd-mobile';

import http from '../util/http';
import style from './style.css';

class BillMember extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      list: []
    }
  }

  componentDidMount() {
    document.body.scrollTop = 0;

    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http.request({
      url: '/bill/member/list',
      data: {
        member_id: this.props.params.member_id,
        page_index: 0,
        page_size: 0
      },
      success: function (data) {
        this.setState({
          list: data
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
      pathname: '/team/index',
      query: {}
    }));
  }

  handleClick(member_id) {

  }

  render() {
    const Item = List.Item;
    const Brief = Item.Brief;

    return (
      <div>
        <NavBar className={style.header} mode="light" leftContent="返回"
                onLeftClick={this.handleBack.bind(this)}
        >他的账单</NavBar>
        <div className={style.page}>
          <WhiteSpace size="lg"/>
          {
            this.state.list.length > 0 ?
              <List>
                {
                  this.state.list.map(function (item) {
                    return (
                      <Item arrow="horizontal"  onClick={this.handleClick.bind(this, item.bill_id)}
                            extra={(item.bill_is_income ? '+' : '-') + '￥' + item.bill_amount.toFixed(2)}>
                        {
                          item.bill_type == 'ORDER' ? '订单' : ''
                        }
                        {
                          item.bill_type == 'COMMISSION' ? '佣金' : ''
                        }
                        <Brief>{item.bill_time}</Brief>
                      </Item>
                    )
                  }.bind(this))
                }
              </List>
              :
              ''
          }
          {
            this.state.is_load && this.state.list.length == 0 ?
              <view className={style.noData}>
                <img src={require('../assets/svg/empty.svg')} className={style.noDataImageIcon}></img>
                <view className={style.noDataText}>当前没有数据</view>
              </view>
              :
              ''
          }
        </div>
      </div>
    );
  }
}

BillMember.propTypes = {};

export default connect(() => ({}))(BillMember);
