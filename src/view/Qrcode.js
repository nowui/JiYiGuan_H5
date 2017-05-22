import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { NavBar } from 'antd-mobile';

import http from '../util/http';
import style from './style.css';

class Qrcode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qrcode: '',
    };
  }

  componentDidMount() {
    document.body.scrollTop = 0;

    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http({
      url: '/member/qrcode/find',
      data: {},
      success: function (data) {
        this.setState({
          qrcode: data,
        });
      }.bind(this),
      complete() {

      },
    }).post();
  }

  handleBack() {
    this.props.dispatch(routerRedux.push({
      pathname: '/my',
      query: {},
    }));
  }

  render() {
    return (
      <div>
        <NavBar
          className={style.header} mode="light" leftContent="返回"
          onLeftClick={this.handleBack.bind(this)}
        >我的二维码</NavBar>
        <div className={style.page}>
          {
            this.state.qrcode == '' ?
              ''
              :
              <img
                src={this.state.qrcode} style={{
                  width: '100%',
                }}
              />
          }
        </div>
      </div>
    );
  }
}

Qrcode.propTypes = {};

export default connect(({}) => ({}))(Qrcode);
