import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {WhiteSpace} from 'antd-mobile';

import http from '../util/http';
import style from './style.css';

class FavorIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_list: false,
      favor_id: '',
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'main/fetch',
      data: {
        title: '我的收藏'
      },
    });

    document.body.scrollTop = 0;

    // this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http.request({
      url: '/favor/list',
      data: {
        page_index: 1,
        page_size: 10,
      },
      success: function (data) {
        this.props.dispatch({
          type: 'favor/fetch',
          data: {
            list: data,
          },
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: true,
        });
      }.bind(this),
    });
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
        {/*<NavBar*/}
          {/*className={style.header} mode="light" leftContent="返回"*/}
          {/*onLeftClick={this.handleBack.bind(this)}*/}
        {/*>我的收藏</NavBar>*/}
        <div className={style.page}>
          <WhiteSpace size="lg"/>
          <view className={style.noData}>
            <img src={require('../assets/svg/empty.svg')} className={style.noDataImageIcon}></img>
            <view className={style.noDataText}>当前没有数据</view>
          </view>
        </div>
      </div>
    );
  }
}

FavorIndex.propTypes = {};

export default connect(({favor}) => ({favor}))(FavorIndex);
