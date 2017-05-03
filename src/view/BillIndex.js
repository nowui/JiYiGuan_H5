import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, WhiteSpace, List, Checkbox, Result} from 'antd-mobile';

import constant from '../util/constant';
import http from '../util/http';
import style from './style.css';

class BillIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_list: false,
      team_id: '',
    }
  }

  componentDidMount() {
    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http({
      url: '/bill/list',
      data: {
        page_index: 0,
        page_size: 0
      },
      success: function (data) {
        this.props.dispatch({
          type: 'bill/fetch',
          data: {
            list: data
          }
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: true
        });
      }.bind(this)
    }).post();
  }

  handleBack() {
    this.props.dispatch(routerRedux.push({
      pathname: '/mine',
      query: {}
    }));
  }

  handleEdit(team_id) {
    this.props.dispatch(routerRedux.push({
      pathname: '/team/edit/' + this.props.params.type + '/' + team_id,
      query: {}
    }));
  }

  handleClick(member_id) {

  }

  render() {
    const Item = List.Item;
    const CheckboxItem = Checkbox.CheckboxItem;

    return (
      <div>
        <NavBar className={style.header} mode="light" leftContent="返回"
                onLeftClick={this.handleBack.bind(this)}
        >我的账单</NavBar>
        <div className={style.page}>
          <WhiteSpace size="lg"/>
          <List>
            {
              this.props.bill.list.map(function (item) {
                return (
                  <Item wrap key={item.bill_id}
                        onClick={this.handleClick.bind(this, item.bill_id)}>
                    {item.bill_name}
                  </Item>
                )
              }.bind(this))
            }
            {
              this.state.is_load && this.props.bill.list.length == 0 ?
                <Result
                  img={<img src={require('../assets/svg/empty.svg')} style={{width: '1.2rem', height: '1.2rem'}}/>}
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

BillIndex.propTypes = {};

export default connect(({bill}) => ({bill}))(BillIndex);
