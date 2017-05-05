import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { NavBar, WhiteSpace, List, Checkbox, Result } from 'antd-mobile';

import constant from '../util/constant';
import database from '../util/database';
import http from '../util/http';
import style from './style.css';

class DeliveryIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_list: false,
      delivery_id: '',
    };
  }

  componentDidMount() {
    if (this.props.params.type == 'list') {
      this.setState({
        is_list: true,
      });
    }

    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http({
      url: '/delivery/list',
      data: {
        page_index: 1,
        page_size: 10,
      },
      success: function (data) {
        this.props.dispatch({
          type: 'delivery/fetch',
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
    if (this.props.params.type.indexOf('check_') > -1) {
      this.props.dispatch(routerRedux.push({
        pathname: '/order/check',
        pathname: `/${this.props.params.type.replace('_', '/').replace('_', '/')}`,
        query: {},
      }));
    }

    if (this.props.params.type == 'list') {
      this.props.dispatch(routerRedux.push({
        pathname: '/my',
        query: {},
      }));
    }
  }

  handleAdd() {
    this.props.dispatch(routerRedux.push({
      pathname: `/delivery/add/${this.props.params.type}`,
      query: {},
    }));
  }

  handleEdit(delivery_id) {
    this.props.dispatch(routerRedux.push({
      pathname: `/delivery/edit/${this.props.params.type}/${delivery_id}`,
      query: {},
    }));
  }

  handleChange(delivery) {
    this.setState({
      delivery_id: delivery.delivery_id,
    });

    database.setDelivery(delivery);

    setTimeout(() => {
      this.handleBack();
    }, 300);
  }

  render() {
    const Item = List.Item;
    const CheckboxItem = Checkbox.CheckboxItem;

    return (
      <div>
        <NavBar
          className={style.header} mode="light" leftContent="返回"
          onLeftClick={this.handleBack.bind(this)}
          rightContent={[<div onClick={this.handleAdd.bind(this)} key="add">新增</div>]}
        >我的地址</NavBar>
        <div className={style.page}>
          <WhiteSpace size="lg" />
          <List>
            {
              this.props.delivery.list.map((item) => {
                return (
                  this.state.is_list ?
                    <Item
                      key={item.delivery_id} arrow={this.state.is_list ? 'horizontal' : 'empty'} wrap
                      onClick={this.handleEdit.bind(this, item.delivery_id)}
                    >
                      <div>{item.delivery_name} {item.delivery_phone}</div>
                      <div className={style.deliveryAddress}>{item.delivery_address}</div>
                    </Item>
                    :
                    <CheckboxItem
                      key={item.delivery_id}
                      wrap
                      activeStyle={{
                        backgroundColor: '#ffffff',
                      }}
                      checked={this.state.delivery_id == item.delivery_id}
                      onChange={this.handleChange.bind(this, item)}
                    >
                      <div>{item.delivery_name} {item.delivery_phone}</div>
                      <div className={style.deliveryAddress}>{item.delivery_address}</div>
                    </CheckboxItem>
                );
              })
            }
            {
              this.state.is_load && this.props.delivery.list.length == 0 ?
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

DeliveryIndex.propTypes = {};

export default connect(({ delivery }) => ({ delivery }))(DeliveryIndex);
