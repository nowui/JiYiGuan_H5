import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {List} from 'antd-mobile';

import constant from '../util/constant';
import http from '../util/http';
import wechat from '../util/wechat';

import style from './style.css';

class StoryIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'main/fetch',
      data: {
        title: '睡前故事'
      },
    });

    document.body.scrollTop = this.props.story.scroll_top;

    if (this.props.story.list.length == 0) {
      this.handleLoad();
    }

    wechat.share('', '', '', 'http://h5.jiyiguan.nowui.com/#/science/index/');
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'story/fetch',
      data: {
        scroll_top: document.body.scrollTop
      },
    });
  }

  handleLoad() {
    http.request({
      url: '/article/story/list',
      data: {},
      success: function (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].article_image_file = constant.host + data[i].article_image_file;
        }

        this.props.dispatch({
          type: 'story/fetch',
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
      pathname: '/story/detail/' + article_id,
      query: {}
    }));
  }

  render() {
    const Item = List.Item;

    return (
      <div>
        {/*<NavBar className={style.header} mode="light" iconName={false}>睡前故事</NavBar>*/}
        <div className={style.page}>
          <List>
            {
              this.props.story.list.map((item) => {
                return (
                  <Item
                    key={item.article_id}
                    onClick={this.handleArticle.bind(this, item.article_id)}
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

StoryIndex.propTypes = {};

export default connect(({story}) => ({story}))(StoryIndex);
