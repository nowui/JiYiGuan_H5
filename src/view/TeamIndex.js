import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { NavBar, WhiteSpace, List, Checkbox, Result } from 'antd-mobile';

import constant from '../util/constant';
import database from '../util/database';
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
    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http({
      url: '/member/team/list',
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
          <WhiteSpace size="lg" />
          <List>
            {
              this.props.team.list.map((item) => {
                return (
                  <Item  arrow="horizontal"
                    wrap key={item.member_id}
                    onClick={this.handleClick.bind(this, item.member_id)}
                  >
                    {item.member_name}
                  </Item>
                );
              })
            }
            {
              this.state.is_load && this.props.team.list.length == 0 ?
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

TeamIndex.propTypes = {};

export default connect(({ team }) => ({ team }))(TeamIndex);
