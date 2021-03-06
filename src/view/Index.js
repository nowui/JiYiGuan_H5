import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {Carousel} from 'antd-mobile';

import constant from '../util/constant';
import http from '../util/http';

import style from './style.css';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category_list: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'main/fetch',
      data: {
        title: '商城首页'
      },
    });

    document.body.scrollTop = this.props.index.scroll_top;

    if (this.props.index.list.length == 0) {
      this.handleLoad();
    }

    var category_list = constant.category_list.concat();
    category_list.splice(0, 1);
    category_list.push(constant.category_list[0]);

    this.setState({
      category_list,
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'index/fetch',
      data: {
        scroll_top: document.body.scrollTop,
      },
    });
  }

  handleLoad() {
    http.request({
      url: '/product/all/list',
      data: {},
      success: function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].product_image_file = constant.host + data[i].product_image_file;
        }

        this.props.dispatch({
          type: 'index/fetch',
          data: {
            list: data,
          },
        });
      }.bind(this),
      complete: function () {

      }.bind(this),
    });
  }

  handleCategory(category_id) {
    this.props.dispatch(routerRedux.push({
      pathname: '/category/' + category_id,
      query: {},
    }));
  }

  handleProduct(product_id) {
    this.props.dispatch(routerRedux.push({
      pathname: '/product/detail/index/' + product_id,
      query: {},
    }));
  }

  render() {
    return (
      <div>
        {/*<NavBar className={style.header} mode="light" iconName={false}>商城首页</NavBar>*/}
        <div className={style.page2}>
          <Carousel autoplay infinite>
            <img
              src="http://api.jiyiguan.nowui.com/upload/6a4dbae2ac824d2fb170638d55139666/original/00b1216e83b84226978d63703e7d597b.jpg"
            />
            <img
              src="http://api.jiyiguan.nowui.com/upload/6a4dbae2ac824d2fb170638d55139666/original/00b1216e83b84226978d63703e7d597b.jpg"
            />
            <img
              src="http://api.jiyiguan.nowui.com/upload/6a4dbae2ac824d2fb170638d55139666/original/00b1216e83b84226978d63703e7d597b.jpg"
            />
          </Carousel>
          <div className={style.homeCategory}>
            {
              this.state.category_list.map((item) => {
                return (
                  <div className={style.homeCategoryItem} key={item.category_id}
                       onClick={this.handleCategory.bind(this, item.category_id)}>
                    <div className={style.homeCategoryItemIcon} style={{background: item.category_color}}>
                      <img
                        className={style.homeCategoryItemIconImage}
                        src={require('../assets/svg/' + item.category_image)}
                      />
                    </div>
                    {item.category_name}
                  </div>
                );
              })
            }
          </div>
          {
            this.props.index.list.map((item) => {
              return (
                <div
                  className={style.productCard}
                  style={{width: (document.documentElement.clientWidth - 25) / 2 + 'px', margin: '7px 0 0 7px'}}
                  key={item.product_id}
                  onClick={this.handleProduct.bind(this, item.product_id)}
                >
                  <img
                    style={{
                      width: (document.documentElement.clientWidth - 25) / 2 + 'px',
                      height: (document.documentElement.clientWidth - 25) / 2 + 'px',
                    }}
                    src={item.product_image_file}
                  />
                  <div className={style.productCardName}>{item.product_name}</div>
                  <div className={style.productCardPrice}>¥{item.product_price}</div>
                </div>
              );
            })
          }
          <div style={{float: 'left', width: '100%', height: '7px'}}/>
        </div>
      </div>
    );
  }
}

Index.propTypes = {};

export default connect(({index}) => ({index}))(Index);
