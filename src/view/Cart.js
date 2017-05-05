import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { NavBar, WhiteSpace, List, Stepper, Checkbox, Result } from 'antd-mobile';

import constant from '../util/constant';
import database from '../util/database';
import style from './style.css';

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_all: false,
      is_select: false,
      is_edit: false,
      cart_total: 0,
      cart_list: database.getCartList(),
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleRight() {
    this.setState({
      is_edit: !this.state.is_edit,
    });
  }

  handleChangeItem(product) {
    var isAll = true;
    var isSelect = false;
    var cartTotal = 0;
    var cartList = this.state.cart_list;

    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].product_id == product.product_id) {
        cartList[i].is_check = !cartList[i].is_check;
      }

      if (cartList[i].is_check) {
        isSelect = true;

        cartTotal += cartList[i].product_quantity * cartList[i].product_price[0].product_price;
      } else {
        isAll = false;
      }
    }

    this.setState({
      is_all: isAll,
      is_select: isSelect,
      cart_total: cartTotal,
      cart_list: cartList,
    });
  }

  handleChangeAll() {
    var isAll = !this.state.is_all;
    var isSelect = false;
    var cartTotal = 0;
    var cartList = this.state.cart_list;

    for (var i = 0; i < cartList.length; i++) {
      cartList[i].is_check = isAll;

      if (isAll) {
        isSelect = true;

        cartTotal += cartList[i].product_quantity * cartList[i].product_price[0].product_price;
      }
    }

    this.setState({
      is_all: isAll,
      is_select: isSelect,
      cart_total: cartTotal,
      cart_list: cartList,
    });
  }

  handleChangeStepper(product_id, product_quantity) {
    var cartTotal = 0;
    var cartList = this.state.cart_list;

    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].product_id == product_id) {
        cartList[i].product_quantity = product_quantity;
      }

      if (cartList[i].is_check) {
        cartTotal += cartList[i].product_quantity * cartList[i].product_price[0].product_price;
      }
    }

    database.setCartList(cartList);

    this.setState({
      cart_total: cartTotal,
      cart_list: cartList,
    });
  }

  handleDelete(index) {
    var isAll = true;
    var isSelect = false;
    var cartTotal = 0;
    var cartList = this.state.cart_list;

    cartList.splice(index, 1);

    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].is_check) {
        isSelect = true;

        cartTotal += cartList[i].product_quantity * cartList[i].product_price[0].product_price;
      } else {
        isAll = false;
      }
    }

    database.setCartList(cartList);

    this.props.handlCart();

    this.setState({
      is_all: isAll,
      is_select: isSelect,
      cart_total: cartTotal,
      cart_list: cartList,
    });
  }

  handleSubmit() {
    var cartList = this.state.cart_list;
    var unCheckCartList = [];
    var productList = [];

    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].is_check) {
        productList.push(cartList[i]);
      } else {
        unCheckCartList.push(cartList[i]);
      }
    }

    database.setCartList(unCheckCartList);
    database.setProduct(productList);

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
        <NavBar
          className={style.header} mode="light" iconName={false}
          rightContent={this.state.cart_list.length == 0 ? [] : [<div
            onClick={this.handleRight.bind(this)}
            key="0"
          >{this.state.is_edit ? '完成' : '编辑'}</div>]}
        >购物车</NavBar>
        <div className={style.page}>
          <WhiteSpace size="lg" />
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
                              style={{ width: '220px' }}
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
                        >{`￥${(item.product_quantity * item.product_price[0].product_price).toFixed(2)}`}</div>
                    }
                  </Item>
                );
              })
            }
            {
              this.state.cart_list.length == 0 ?
                <Result
                  img={<img src={require('../assets/svg/empty.svg')} style={{ width: '1.2rem', height: '1.2rem' }} />}
                  message={constant.empty}
                />
                :
                ''
            }
          </List>
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
              <div className={style.productBuy} style={{ backgroundColor: this.state.is_select ? '#f23030' : '#dddddd' }} onClick={this.handleSubmit.bind(this)}>
                立即购买
              </div>
            </div>
        }
      </div>
    );
  }
}

Cart.propTypes = {};

export default connect(({}) => ({}))(Cart);
