import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {NavBar, Carousel, List, Toast, Badge, WhiteSpace, Stepper} from 'antd-mobile';

import constant from '../util/constant';
import database from '../util/database';
import http from '../util/http';

import style from './style.css';

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_cart: true,
      cart_count: database.getCartList().length,
      product_quantity: 1,
      product: {
        product_image: [],
        product_image_list: [],
        product_price: [],
        product_stock: 0
      }
    }
  }

  componentDidMount() {
    this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http({
      url: '/product/find',
      data: {
        product_id: this.props.params.product_id
      },
      success: function (data) {
        data.product_image_list = JSON.parse(data.product_image_list_original);
        data.product_image = JSON.parse(data.product_image);
        data.product_price = JSON.parse(data.sku_list[0].product_price);
        data.product_stock = data.sku_list[0].product_stock;
        data.sku_id = data.sku_list[0].sku_id;

        this.setState({
          product: data
        });
      }.bind(this),
      complete: function () {

      }.bind(this)
    }).post();
  }

  handleBack() {
    if (this.props.params.type == 'home') {
      this.props.dispatch(routerRedux.push({
        pathname: '/home',
        query: {}
      }));
    }

    if (this.props.params.type.indexOf('category_') > -1) {
      this.props.dispatch(routerRedux.push({
        pathname: this.props.params.type.replace('_', '/'),
        query: {}
      }));
    }
  }

  handleSubmit() {
    if (this.state.is_cart) {
      database.addCart({
        product_id: this.state.product.product_id,
        product_name: this.state.product.product_name,
        product_image: this.state.product.product_image[0],
        product_price: this.state.product.product_price,
        product_quantity: this.state.product_quantity,
        product_stock: this.state.product.product_stock,
        sku_id: this.state.product.sku_id
      });

      this.setState({
        cart_count: database.getCartList().length
      });
    } else {
      database.setProduct([{
        product_id: this.state.product.product_id,
        product_name: this.state.product.product_name,
        product_image: this.state.product.product_image[0],
        product_price: this.state.product.product_price,
        product_quantity: this.state.product_quantity,
        sku_id: this.state.product.sku_id
      }]);

      setTimeout(function () {
        this.props.dispatch(routerRedux.push({
          pathname: '/order/check/product_' + this.props.params.product_id,
          query: {}
        }));
      }.bind(this), 500);
    }
  }

  handleGo() {
    this.props.dispatch(routerRedux.push({
      pathname: '/cart',
      query: {}
    }));
  }

  handleCart() {
    database.addCart({
      product_id: this.state.product.product_id,
      product_name: this.state.product.product_name,
      product_image: this.state.product.product_image[0],
      product_price: this.state.product.product_price,
      product_quantity: this.state.product_quantity,
      product_stock: this.state.product.product_stock,
      sku_id: this.state.product.sku_id
    });

    this.setState({
      cart_count: database.getCartList().length
    });

    Toast.success('加入成功', constant.duration);
  }

  handleHome() {
    this.props.dispatch(routerRedux.push({
      pathname: '/home',
      query: {}
    }));
  }

  handleFavor() {
    Toast.success('收藏成功', constant.duration);
  }

  handleBuy() {
    database.setProduct([{
      product_id: this.state.product.product_id,
      product_name: this.state.product.product_name,
      product_image: this.state.product.product_image[0],
      product_price: this.state.product.product_price,
      product_quantity: this.state.product_quantity,
      sku_id: this.state.product.sku_id
    }]);

    this.props.dispatch(routerRedux.push({
      pathname: '/order/check/product_detail_' + this.props.params.type + '_' + this.props.params.product_id,
      query: {}
    }));
  }

  handleQuantity(product_quantity) {
    this.setState({
      product_quantity: product_quantity
    });
  }

  render() {
    const Item = List.Item;

    return (
      <div>
        <NavBar className={style.header} mode="light" leftContent="返回"
                onLeftClick={this.handleBack.bind(this)}
                rightContent={[<Badge key={1} text={this.state.cart_count} onClick={this.handleGo.bind(this)}><img
                  className={style.cartIcon} src={require('../assets/svg/cart.svg')}
                  onClick={this.handleGo.bind(this)}/></Badge>]}
        >商品详情</NavBar>
        <div className={style.page}>
          {
            this.state.product.product_image_list.length == 0 ?
              ''
              :
              <Carousel autoplay={true} infinite={true} style={{height: document.documentElement.clientWidth + 'px'}}>
                {
                  this.state.product.product_image_list.map(function (item, index) {
                    return (
                      <img key={index} style={{width: document.documentElement.clientWidth + 'px', height: document.documentElement.clientWidth + 'px'}} src={constant.host + item}/>
                    )
                  }.bind(this))
                }
              </Carousel>
          }
          <List>
            <Item>
              {this.state.product.product_name}
              <br/>
              {
                this.state.product.product_price.length > 0 ?
                  <span
                    className={style.productPopupRedText}>￥{this.state.product.product_price[0].product_price.toFixed(2)}</span>
                  :
                  ''
              }
            </Item>
          </List>
          <WhiteSpace size="lg"/>
          <List>
            <Item>
              已选：{this.state.product_quantity} 个
            </Item>
            <Item>
              <Stepper
                style={{width: '200px', minWidth: '2rem'}}
                showNumber={true}
                max={99999}
                min={1}
                defaultValue={this.state.product_quantity}
                onChange={this.handleQuantity.bind(this)}
                useTouch={!window.isPC}
              />
            </Item>
          </List>
          <WhiteSpace size="lg"/>
          <div className={style.productContent}
               dangerouslySetInnerHTML={{__html: this.state.product.product_content}}></div>
        </div>
        <div className={style.footer}>
          <div className={style.productHome} onClick={this.handleHome.bind(this)}>
            <img className={style.productIcon} src={require('../assets/svg/home.svg')}/>
            <div className={style.productFont}>首页</div>
          </div>
          <div className={style.productFavor} onClick={this.handleFavor.bind(this)}>
            <img className={style.productIcon} src={require('../assets/svg/favor.svg')}/>
            <div className={style.productFont}>收藏</div>
          </div>
          <div className={style.productAddCart} onClick={this.handleCart.bind(this)}>加入购物车</div>
          <div className={style.productBuy} onClick={this.handleBuy.bind(this)}>立即购买</div>
        </div>
      </div>
    );
  }
}

ProductDetail.propTypes = {};

export default connect(({}) => ({}))(ProductDetail);
