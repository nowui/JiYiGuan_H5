import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, List, Tabs} from 'antd-mobile';

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
      pathname: '/order/detail/' + this.state.order_flow + '/' + order_id,
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
            <TabPane tab="全部订单" key="ALL"/>
            <TabPane tab="代付款" key="WAIT_PAY"/>
            <TabPane tab="代发货" key="WAIT_SEND"/>
            <TabPane tab="代收货" key="WAIT_RECEIVE"/>
            <TabPane tab="已完成" key="FINISH"/>
          </Tabs>
          {
            this.state.order_list.map((order) => {
              var order_status = '';
              var order_status_list = constant.order_status_list;
              for(var i = 0; i < order_status_list.length; i++) {
                if (order_status_list[i].order_status_value == order.order_flow) {
                  order_status = order_status_list[i].order_status_name;

                  break;
                }
              }

              return (
                <List style={{marginTop: '30px'}} key={order.order_id} onClick={this.handleClick.bind(this, order.order_id)}>
                  <Item extra={order_status}>
                    {order.order_number}
                  </Item>
                  {
                    order.product_list.map((product) => {
                      return (
                        <Item
                          key={product.product_id}
                        >
                          <div className={style.avatar}>
                            <img src={constant.host + product.product_image_file} style={{width: '100%', height: '100%'}}/>
                          </div>
                          <div className={style.name}>{product.product_name}</div>
                          <div className={style.totalAmount}>
                            ￥{product.product_price} X {product.product_quantity}
                          </div>
                        </Item>
                      );
                    })
                  }
                  <Item>
                    <span style={{fontSize: '28px'}}>共{order.product_list.length}件商品，合计：￥{order.order_amount}</span>
                  </Item>
                </List>
              );
            })
          }
          {
            this.state.is_load && this.state.order_list.length == 0 ?
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

OrderIndex.propTypes = {};

export default connect(({order}) => ({order}))(OrderIndex);
