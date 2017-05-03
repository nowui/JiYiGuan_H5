import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, WhiteSpace} from 'antd-mobile';

import database from '../util/database';
import http from '../util/http';
import style from './style.css';

class Qrcode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qrcode: ''
    }
  }

  componentDidMount() {
    if (database.getMemberLevel().member_level_value < 3) {
      this.handleLoad();
    }
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http({
      url: '/member/qrcode/find',
      data: {},
      success: function (data) {
        database.setSceneQrcode(data);

        this.setState({
          qrcode: data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleBack() {
    this.props.dispatch(routerRedux.push({
      pathname: '/mine',
      query: {}
    }));
  }

  render() {
    return (
      <div>
        <NavBar className={style.header} mode="light" leftContent="返回"
                onLeftClick={this.handleBack.bind(this)}>我的二维码</NavBar>
        <div className={style.page}>
          {
            this.state.qrcode == '' ?
              ''
              :
              <img src={this.state.qrcode} style={{
                width: '100%'
              }}/>
          }
        </div>
      </div>
    );
  }
}

Qrcode.propTypes = {};

export default connect(({}) => ({}))(Qrcode);
