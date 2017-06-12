import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, List} from 'antd-mobile';

import constant from '../util/constant';
import http from '../util/http';

import style from './style.css';

class ScienceIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category_list: [],
    };
  }

  componentDidMount() {
    document.body.scrollTop = this.props.science.scroll_top;

    if (this.props.science.list.length == 0) {
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
      type: 'science/fetch',
      data: {
        scroll_top: document.body.scrollTop
      },
    });
  }

  handleLoad() {
    http.request({
      url: '/article/science/list',
      data: {

      },
      success: function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].article_image_file = constant.host + data[i].article_image_file;
        }

        this.props.dispatch({
          type: 'science/fetch',
          data: {
            list: data
          }
        });
      }.bind(this),
      complete: function () {

      }.bind(this),
    });
  }

  handleArticle(article_id) {
    this.props.dispatch(routerRedux.push({
      pathname: '/science/detail/' + article_id,
      query: {}
    }));
  }

  render() {
    const Item = List.Item;

    return (
      <div>
        <NavBar className={style.header} mode="light" iconName={false}>医学科普</NavBar>
        <div className={style.page}>
          <List>
            {
              this.props.science.list.map((item, index) => {
                return (
                  <Item
                    key={item.article_id}
                    onClick={this.handleArticle.bind(this, index)}
                    arrow="horizontal"
                  >
                    <div className={style.articleImage}>
                      <img src={item.article_image_file} style={{width: '100%', height: '100%'}}/>
                    </div>
                    <div className={style.articleName}>{item.article_name}</div>
                    <div className={style.articleSummary}>{item.article_summary}</div>
                  </Item>
                );
              })
            }
          </List>
        </div>
      </div>
    );
  }
}

ScienceIndex.propTypes = {};

export default connect(({science}) => ({science}))(ScienceIndex);
