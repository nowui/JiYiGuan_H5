import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, Modal} from 'antd-mobile';

import http from '../util/http';
import style from './style.css';

const prompt = Modal.prompt;

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
    http.request({
      url: '/member/qrcode/find',
      data: {},
      success: function (data) {
        this.setState({
          qrcode: data,
        });
      }.bind(this),
      complete() {

      },
    });
  }

  handleBack() {
    this.props.dispatch(routerRedux.push({
      pathname: '/my',
      query: {},
    }));
  }

  handleTeam() {
    prompt(
      '输入密码',
      '',
      function (password) {
        this.props.dispatch(routerRedux.push({
          pathname: '/team/index',
          query: {},
        }));
      }.bind(this),
      'secure-text',
    )
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
          <div style={{width: '100%', height: '200px'}} onClick={this.handleTeam.bind(this)}>

          </div>
        </div>
      </div>
    );
  }
}

Qrcode.propTypes = {};

export default connect(({}) => ({}))(Qrcode);
