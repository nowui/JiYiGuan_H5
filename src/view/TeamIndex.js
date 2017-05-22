import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, WhiteSpace, List} from 'antd-mobile';

import http from '../util/http';
import style from './style.css';

class TeamIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_list: false,
      team_id: '',
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
      url: '/order/team/list',
      data: {
        page_index: 1,
        page_size: 10,
      },
      success: function (data) {
        this.props.dispatch({
          type: 'team/fetch',
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
    }).post();
  }

  handleBack() {
    this.props.dispatch(routerRedux.push({
      pathname: '/my',
      query: {},
    }));
  }

  handleClick(member_id) {
    this.props.dispatch(routerRedux.push({
      pathname: '/bill/member/index/' + member_id,
      query: {},
    }));
  }

  render() {
    const Item = List.Item;

    return (
      <div>
        <NavBar
          className={style.header} mode="light" leftContent="返回"
          onLeftClick={this.handleBack.bind(this)}
        >我的团队</NavBar>
        <div className={style.page}>
          <WhiteSpace size="lg"/>
          {
            this.props.team.list.length > 0 ?
              <List>
                {
                  this.props.team.list.map((item) => {
                    return (
                      <Item arrow="horizontal"
                            extra={<div className={style.teamMoney}>
                              <div>计提：￥{item.member_total_amount.toFixed(2)}</div>
                            </div>}
                            wrap key={item.member_id}
                            onClick={this.handleClick.bind(this, item.member_id)}
                      >
                        <div className={style.teamAvatar}>
                          <img src={item.user_avatar} style={{width: '100%', height: '100%'}}/>
                        </div>
                        <div className={style.teamName}>{item.member_name}</div>
                        <div className={style.teamLevel}>
                          {item.member_level_name}
                        </div>
                      </Item>
                    );
                  })
                }
              </List>
              :
              ''
          }
          {
            this.state.is_load && this.props.team.list.length == 0 ?
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

TeamIndex.propTypes = {};

export default connect(({team}) => ({team}))(TeamIndex);
