import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {WhiteSpace, List, Stepper, Checkbox} from 'antd-mobile';

import constant from '../util/constant';
import storage from '../util/storage';
import style from './style.css';

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_all: false,
      is_select: false,
      is_edit: false,
      cart_total: 0,
      cart_list: storage.getCart(),
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'main/fetch',
      data: {
        title: '购物车'
      },
    });

    document.body.scrollTop = 0;
  }

  componentWillUnmount() {

  }

  handleRight() {
    this.setState({
      is_edit: !this.state.is_edit,
    });
  }

  handleChangeItem(product) {
    var is_all = true;
    var is_select = false;
    var cart_total = 0;
    var cart_list = this.state.cart_list;

    for (var i = 0; i < cart_list.length; i++) {
      if (cart_list[i].product_id == product.product_id) {
        cart_list[i].is_check = !cart_list[i].is_check;
      }

      if (cart_list[i].is_check) {
        is_select = true;

        cart_total += cart_list[i].product_quantity * cart_list[i].product_price[0].product_price;
      } else {
        is_all = false;
      }
    }

    this.setState({
      is_all: is_all,
      is_select: is_select,
      cart_total: cart_total,
      cart_list: cart_list,
    });
  }

  handleChangeAll() {
    var is_all = !this.state.is_all;
    var is_select = false;
    var cart_total = 0;
    var cart_list = this.state.cart_list;

    for (var i = 0; i < cart_list.length; i++) {
      cart_list[i].is_check = is_all;

      if (is_all) {
        is_select = true;

        cart_total += cart_list[i].product_quantity * cart_list[i].product_price[0].product_price;
      }
    }

    this.setState({
      is_all: is_all,
      is_select: is_select,
      cart_total: cart_total,
      cart_list: cart_list,
    });
  }

  handleChangeStepper(product_id, product_quantity) {
    var cart_total = 0;
    var cart_list = this.state.cart_list;

    for (var i = 0; i < cart_list.length; i++) {
      if (cart_list[i].product_id == product_id) {
        cart_list[i].product_quantity = product_quantity;
      }

      if (cart_list[i].is_check) {
        cart_total += cart_list[i].product_quantity * cart_list[i].product_price[0].product_price;
      }
    }

    storage.setCart(cart_list);

    this.setState({
      cart_total: cart_total,
      cart_list: cart_list,
    });
  }

  handleDelete(index) {
    var is_all = true;
    var is_select = false;
    var cart_total = 0;
    var cart_list = this.state.cart_list;

    cart_list.splice(index, 1);

    for (var i = 0; i < cart_list.length; i++) {
      if (cart_list[i].is_check) {
        is_select = true;

        cart_total += cart_list[i].product_quantity * cart_list[i].product_price[0].product_price;
      } else {
        is_all = false;
      }
    }

    storage.setCart(cart_list);

    this.props.handlCart();

    this.setState({
      is_all: is_all,
      is_select: is_select,
      cart_total: cart_total,
      cart_list: cart_list,
    });
  }

  handleSubmit() {
    var cart_list = this.state.cart_list;
    var uncheck_cart_list = [];
    var product_list = [];

    for (var i = 0; i < cart_list.length; i++) {
      if (cart_list[i].is_check) {
        product_list.push(cart_list[i]);
      } else {
        uncheck_cart_list.push(cart_list[i]);
      }
    }

    storage.setCart(uncheck_cart_list);
    storage.setProduct(product_list);

    this.props.dispatch(routerRedux.push({
      pathname: '/order/check/cart',
      query: {},
    }));
  }

  render() {
    const Item = List.Item;
    const CheckboxItem = Checkbox.CheckboxItem;

    return (
      <div>
        {/*<NavBar*/}
          {/*className={style.header} mode="light" iconName={false}*/}
          {/*rightContent={this.state.cart_list.length == 0 ? [] : [<div*/}
            {/*onClick={this.handleRight.bind(this)}*/}
            {/*key="0"*/}
          {/*>{this.state.is_edit ? '完成' : '编辑'}</div>]}*/}
        {/*>购物车</NavBar>*/}
        <div className={style.page2}>
          <WhiteSpace size="lg"/>
          {
            this.state.cart_list.length > 0 ?
              <List>
                {
                  this.state.cart_list.map((item, index) => {
                    return (
                      <Item
                        key={item.product_id}
                        className={style.cartItem}
                      >
                        <CheckboxItem
                          checked={item.is_check} className={style.cartProductListCheckbox} activeStyle={{
                          backgroundColor: '#ffffff',
                        }} onChange={this.handleChangeItem.bind(this, item)}
                        />
                        <img
                          className={style.cartProductListImage}
                          src={constant.host + item.product_image_file}
                        />
                        <div className={style.cartProductListText}>
                          {item.product_name}
                          {
                            this.state.is_edit ?
                              <div>
                                <Stepper
                                  style={{width: '220px'}}
                                  showNumber={false}
                                  max={item.product_stock}
                                  min={1}
                                  defaultValue={item.product_quantity}
                                  onChange={this.handleChangeStepper.bind(this, item.product_id)}
                                  useTouch={!window.isPC}
                                />
                                <div className={style.cartProductListQuantity}>
                                  <div className={style.cartProductListQuantityNumber}>{item.product_quantity}</div>
                                </div>
                              </div>
                              :
                              <div>× {item.product_quantity}</div>
                          }
                        </div>
                        {
                          this.state.is_edit ?
                            <div className={style.cartProductListDelete} onClick={this.handleDelete.bind(this, index)}>
                              删除</div>
                            :
                            <div
                              className={style.cartProductListPrice}
                            >{'￥' + (item.product_quantity * item.product_price[0].product_price).toFixed(2)}</div>
                        }
                      </Item>
                    );
                  })
                }
              </List>
              :
              <view className={style.noData}>
                <img src={require('../assets/svg/empty.svg')} className={style.noDataImageIcon}></img>
                <view className={style.noDataText}>当前没有数据</view>
              </view>
          }
        </div>
        {
          this.state.cart_list.length == 0 ?
            ''
            :
            <div className={style.footer2}>
              <div className={style.checkTotal}>
                <CheckboxItem
                  checked={this.state.is_all} activeStyle={{
                  backgroundColor: '#ffffff',
                }} className={style.CheckboxItem} onChange={this.handleChangeAll.bind(this)}
                >
                  全选
                </CheckboxItem>
                <div className={style.checkTotalCartText}>￥{this.state.cart_total.toFixed(2)}</div>
              </div>
              <div className={style.productBuy} style={{backgroundColor: this.state.is_select ? '#f23030' : '#dddddd'}}
                   onClick={this.handleSubmit.bind(this)}>
                立即购买
              </div>
            </div>
        }
      </div>
    );
  }
}

export default connect(({}) => ({}))(Cart);
