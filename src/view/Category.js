import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import constant from '../util/constant';
import http from '../util/http';

import style from './style.css';

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category_id: '0',
      category_list: [],
      product_list: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'main/fetch',
      data: {
        title: '商品分类'
      },
    });

    document.body.scrollTop = 0;

    var category_id = '0';
    var category_list = constant.category_list.concat();
    var product_list = [];

    if (typeof (this.props.params.category_id) !== 'undefined') {
      category_id = this.props.params.category_id;
    }

    if (this.props.category.product_list.length == 0) {
      this.handleLoad();
    } else {
      for (var i = 0; i < this.props.category.product_list.length; i++) {
        if (this.props.category.product_list[i].category_id == category_id || category_id == '0') {
          product_list.push(this.props.category.product_list[i]);
        }
      }
    }

    this.setState({
      category_id: this.props.params.category_id,
      category_list,
      product_list,
    });
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http.request({
      url: '/product/all/list',
      data: {},
      success: function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].product_image_file = constant.host + data[i].product_image_file;
        }

        const product_list = [];

        for (var i = 0; i < data.length; i++) {
          if (data[i].category_id == this.state.category_id || this.state.category_id == '0') {
            product_list.push(data[i]);
          }
        }

        this.props.dispatch({
          type: 'category/fetch',
          data: {
            product_list: data,
          },
        });

        this.setState({
          product_list,
        });
      }.bind(this),
      complete() {

      },
    });
  }

  handleBack() {
    this.props.dispatch(routerRedux.push({
      pathname: '/index',
      query: {},
    }));
  }

  handleCategory(category_id) {
    const product_list = [];
    for (var i = 0; i < this.props.category.product_list.length; i++) {
      if (this.props.category.product_list[i].category_id == category_id || category_id == '0') {
        product_list.push(this.props.category.product_list[i]);
      }
    }

    this.setState({
      category_id,
      product_list,
    });
  }

  handleProduct(product_id) {
    this.props.dispatch(routerRedux.push({
      pathname: '/product/detail/category_' + this.state.category_id + '/' + product_id,
      query: {},
    }));
  }

  render() {
    return (
      <div>
        {/*<NavBar*/}
          {/*className={style.header} mode="light" leftContent="返回"*/}
          {/*onLeftClick={this.handleBack.bind(this)}*/}
        {/*>商品分类</NavBar>*/}
        <div className={style.categoryPage}>
          {
            this.state.product_list.map((item) => {
              return (
                <div
                  className={style.productCard}
                  style={{ width: (document.documentElement.clientWidth - 200 - 25) / 2 + 'px', margin: '7px 0 0 7px' }}
                  key={item.product_id}
                  onClick={this.handleProduct.bind(this, item.product_id)}
                >
                  <img
                    style={{
                      width: (document.documentElement.clientWidth - 200 - 25) / 2 + 'px',
                      height: (document.documentElement.clientWidth - 200 - 25) / 2 + 'px',
                    }}
                    src={item.product_image_file}
                  />
                  <div className={style.productCardName}>{item.product_name}</div>
                  <div className={style.productCardPrice}>¥{item.product_price}</div>
                </div>
              );
            })
          }
          <div style={{ float: 'left', width: '100%', height: '7px' }} />
        </div>
        <div className={style.categoryLeft}>
          {
            this.state.category_list.map((item) => {
              const itemStyle = item.category_id == this.state.category_id ? style.categoryLeftItem + ' ' + style.categoryLeftItemActive : style.categoryLeftItem;

              return (
                <div
                  className={itemStyle} key={item.category_id}
                  onClick={this.handleCategory.bind(this, item.category_id)}
                >{item.category_name}</div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

Category.propTypes = {};

export default connect(({ category }) => ({ category }))(Category);
