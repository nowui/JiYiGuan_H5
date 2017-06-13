import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import http from '../util/http';
import wechat from '../util/wechat';

import style from './style.css';

class ScienceDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      article: {},
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'main/fetch',
      data: {
        title: '医学科普'
      },
    });

    document.body.scrollTop = 0;

    this.handleLoad();

    wechat.share();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http.request({
      url: '/article/find',
      data: {
        article_id: this.props.params.article_id
      },
      success: function (data) {
        this.setState({
          article: data
        });
      }.bind(this),
      complete: function () {

      }.bind(this),
    });
  }

  handleBack() {
    this.props.dispatch(routerRedux.goBack());
  }

  render() {
    return (
      <div>
        {/*<NavBar*/}
          {/*className={style.header} mode="light" leftContent="返回"*/}
          {/*onLeftClick={this.handleBack.bind(this)}*/}
        {/*>{this.state.article.article_name}</NavBar>*/}
        <div className={style.page}>
          <div style={{textAlign: 'center'}}><h1>{this.state.article.article_name}</h1></div>
          <div className={style.articleContent} dangerouslySetInnerHTML={{__html: this.state.article.article_content}}></div>
        </div>
      </div>
    );
  }
}

ScienceDetail.propTypes = {};

export default connect(({science}) => ({science}))(ScienceDetail);
