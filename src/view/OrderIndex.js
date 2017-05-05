import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { NavBar, WhiteSpace, List, Result, Tabs } from 'antd-mobile';

import constant from '../util/constant';
import http from '../util/http';

import style from './style.css';

class OrderIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      order_flow: '',
      order_list: [],
    };
  }

  componentDidMount() {
    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http({
      url: '/order/list',
      data: {
        page_index: 1,
        page_size: 10
      },
      success: function (data) {
        this.props.dispatch({
          type: 'order/fetch',
          data: {
            list: data,
          },
        });

        var order_list = [];

        for (var i = 0; i < data.length; i++) {
          if (data[i].order_flow == this.props.params.order_flow || this.props.params.order_flow == 'ALL') {
            order_list.push(data[i]);
          }
        }

        this.setState({
          order_flow: this.props.params.order_flow,
          order_list: order_list
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: true,
        });
      }.bind(this),
    }).post();
  }

  handleBack() {
    this.props.dispatch(routerRedux.push({
      pathname: '/my',
      query: {},
    }));
  }

  handleClick(order_id) {
    this.props.dispatch(routerRedux.push({
      pathname: `/order/detail/${this.state.order_flow}/${order_id}`,
      query: {},
    }));
  }

  handleTab(order_flow) {
    var order_list = [];

    for (var i = 0; i < this.props.order.list.length; i++) {
      if (this.props.order.list[i].order_flow == order_flow || order_flow == 'ALL') {
        order_list.push(this.props.order.list[i]);
      }
    }

    this.setState({
      order_flow: order_flow,
      order_list: order_list
    });

    this.setState({
      order_flow,
    });
  }

  render() {
    const Item = List.Item;
    const TabPane = Tabs.TabPane;

    return (
      <div>
        <NavBar
          className={style.header} mode="light" leftContent="返回"
          onLeftClick={this.handleBack.bind(this)}
        >我的订单</NavBar>
        <div className={style.page}>
          <Tabs activeKey={this.state.order_flow} animated={false} onTabClick={this.handleTab.bind(this)}>
            <TabPane tab="全部订单" key="ALL" />
            <TabPane tab="代付款" key="WAIT_PAY" />
            <TabPane tab="代发货" key="WAIT_SEND" />
            <TabPane tab="代收货" key="WAIT_RECEIVE" />
            <TabPane tab="已完成" key="FINISH" />
          </Tabs>
          <List>
            {
              this.state.order_list.map((item) => {
                return (
                  <Item
                    wrap arrow="horizontal" key={item.order_id}
                    onClick={this.handleClick.bind(this, item.order_id)}
                  >
                    <div>单号： {item.order_number}</div>
                    <div>姓名： {item.order_delivery_name}</div>
                    <div>地址： <span className={style.deliveryAddress}>{item.order_delivery_address}</span></div>
                  </Item>
                );
              })
            }
            {
              this.state.is_load && this.state.order_list.length == 0 ?
                <Result
                  img={<img src={require('../assets/svg/empty.svg')} style={{ width: '1.2rem', height: '1.2rem' }} />}
                  message={constant.empty}
                />
                :
                ''
            }
          </List>
        </div>
      </div>
    );
  }
}

OrderIndex.propTypes = {};

export default connect(({ order }) => ({ order }))(OrderIndex);
