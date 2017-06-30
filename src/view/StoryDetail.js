import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import constant from '../util/constant';
import http from '../util/http';
import wechat from '../util/wechat';

import style from './style.css';

class StoryDetail extends Component {
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
        title: '睡前故事'
      },
    });

    document.body.scrollTop = 0;

    this.handleLoad();
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

        wechat.share(constant.host + data.article_image_file.file_path, data.article_name, data.article_summary, 'http://h5.jiyiguan.nowui.com/#/story/detail/' + this.props.params.article_id);
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

StoryDetail.propTypes = {};

export default connect(({story}) => ({story}))(StoryDetail);
