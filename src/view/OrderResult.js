import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { NavBar, Result, Icon, Button } from 'antd-mobile';

import http from '../util/http';
import style from './style.css';

class OrderResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      result: 'confirm',
      is_pay: false,
      is_error: false,
      order: {},
    };
  }

  componentDidMount() {
    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http({
      url: '/order/confirm',
      data: {
        order_id: this.props.params.order_id,
      },
      success: function (data) {
        if (data.order_is_pay) {
          this.setState({
            result: 'success',
            order: data,
          });
        } else if (this.state.count < 2) {
          this.setState({
            count: this.state.count + 1,
          });

          setTimeout(() => {
            this.handleLoad();
          }, 1500);
        } else {
          this.setState({
            result: 'error',
          });
        }
      }.bind(this),
      complete() {

      },
    }).post();
  }

  handleHome() {
    this.props.dispatch(routerRedux.push({
      pathname: '/home',
      query: {},
    }));
  }

  handleOrder() {
    this.props.dispatch(routerRedux.push({
      pathname: `/order/detail/ALL/${this.props.params.order_id}`,
      query: {},
    }));
  }

  render() {
    return (
      <div className="result">
        <NavBar className={style.header} mode="light" iconName={false}>交易反馈</NavBar>
        <div className={style.page}>
          {
            this.state.result == 'confirm' ?
              <Result
                img={<img src={require('../assets/svg/waiting.svg')} style={{ width: '1.2rem', height: '1.2rem' }} />}
                title="等待确认"
                message="已支付成功，等待平台确认"
              />
              :
              ''
          }
          {
            this.state.result == 'success' ?
              <Result
                img={<Icon
                  type="check-circle"
                  style={{ fill: '#1F90E6', width: '1.2rem', height: '1.2rem' }}
                />}
                title="订单支付成功"
                message={<div>
                  <div
                    style={{
                      fontSize: '0.73rem',
                      color: '#000',
                      lineHeight: 1,
                    }}
                  >
                    <span style={{ fontSize: '0.64rem' }}>￥</span>{Number(this.state.order.order_amount).toFixed(2)}
                  </div>
                </div>}
              />
              :
              ''
          }
          {
            this.state.result == 'error' ?
              <Result
                img={<img src={require('../assets/svg/notice.svg')} style={{ width: '1.2rem', height: '1.2rem' }} />}
                title="网络异常"
                message="请与平台工作人员确认"
              />
              :
              ''
          }
          <div style={{ margin: '100px 10px 0px 10px' }}>
            <Button type="primary" onClick={this.handleHome.bind(this)}>返回首页</Button>
          </div>
          <div style={{ margin: '40px 10px 0px 10px' }}>
            <Button onClick={this.handleOrder.bind(this)}>查看订单</Button>
          </div>
        </div>
      </div>
    );
  }
}

OrderResult.propTypes = {};

export default connect(({}) => ({}))(OrderResult);
