import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, Carousel} from 'antd-mobile';

import constant from '../util/constant';
import wechat from '../util/wechat';
import http from '../util/http';

import style from './style.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category_list: []
    }
  }

  componentDidMount() {
    if (this.props.home.list.length == 0) {
      this.handleLoad();
    } else {
      document.body.scrollTop = this.props.home.scroll_top;
    }

    let category_list = constant.category_list.concat();
    category_list.splice(0, 1);
    category_list.push(constant.category_list[0]);

    this.setState({
      category_list: category_list
    });

    wechat.auth();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'home/fetch',
      data: {
        scroll_top: document.body.scrollTop
      }
    });
  }

  handleLoad() {
    http({
      url: '/product/hot/list',
      data: {

      },
      success: function (data) {
        for (let i = 0; i < data.length; i++) {
          data[i].product_image_file = constant.host + data[i].product_image_file;
        }

        this.props.dispatch({
          type: 'home/fetch',
          data: {
            list: data
          }
        });
      }.bind(this),
      complete: function () {
        document.body.scrollTop = this.props.home.scroll_top;
      }.bind(this)
    }).post();
  }

  handleCategory(category_id) {
    this.props.dispatch(routerRedux.push({
      pathname: '/category/' + category_id,
      query: {}
    }));
  }

  handleProduct(product_id) {
    this.props.dispatch(routerRedux.push({
      pathname: '/product/detail/home/' + product_id,
      query: {}
    }));
  }

  render() {
    return (
      <div>
        <NavBar className={style.header} mode="light" iconName={false}>商城首页</NavBar>
        <div className={style.page}>
          <Carousel autoplay={true} infinite={true}>
            <img
              src='http://api.jiyiguan.nowui.com/upload/6a4dbae2ac824d2fb170638d55139666/original/00b1216e83b84226978d63703e7d597b.jpg'/>
            <img
              src='http://api.jiyiguan.nowui.com/upload/6a4dbae2ac824d2fb170638d55139666/original/00b1216e83b84226978d63703e7d597b.jpg'/>
            <img
              src='http://api.jiyiguan.nowui.com/upload/6a4dbae2ac824d2fb170638d55139666/original/00b1216e83b84226978d63703e7d597b.jpg'/>
          </Carousel>
          <div className={style.homeCategory}>
            {
              this.state.category_list.map(function (item) {
                return (
                  <div className={style.homeCategoryItem} key={item.category_id} onClick={this.handleCategory.bind(this, item.category_id)}>
                    <div className={style.homeCategoryItemIcon} style={{background: item.category_color}}>
                      <img className={style.homeCategoryItemIconImage}
                           src={require('../assets/svg/' + item.category_image)}/>
                    </div>
                    {item.category_name}
                  </div>
                )
              }.bind(this))
            }
          </div>
          {
            this.props.home.list.map(function (item) {
              return (
                <div className={style.productCard}
                     style={{width: (document.documentElement.clientWidth - 25) / 2 + 'px', margin: '7px 0 0 7px'}}
                     key={item.product_id}
                     onClick={this.handleProduct.bind(this, item.product_id)}>
                  <img style={{
                    width: (document.documentElement.clientWidth - 25) / 2 + 'px',
                    height: (document.documentElement.clientWidth - 25) / 2 + 'px'
                  }}
                       src={item.product_image_file}/>
                  <div className={style.productCardName}>{item.product_name}</div>
                  <div className={style.productCardPrice}>¥{item.product_price}</div>
                </div>
              )
            }.bind(this))
          }
          <div style={{float: 'left', width: '100%', height: '7px'}}></div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {};

export default connect(({home}) => ({home}))(Home);
