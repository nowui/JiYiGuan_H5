import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar} from 'antd-mobile';

import style from './style.css';

class StoryDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      article: {},
    };
  }

  componentDidMount() {
    document.body.scrollTop = 0;

    this.setState({
      article: this.props.story.list[this.props.params.index]
    });
  }

  componentWillUnmount() {

  }

  handleBack() {
    this.props.dispatch(routerRedux.goBack());
  }

  render() {
    return (
      <div>
        <NavBar
          className={style.header} mode="light" leftContent="返回"
          onLeftClick={this.handleBack.bind(this)}
        >{this.state.article.article_name}</NavBar>
        <div className={style.page}>
          <div className={style.articleContent} dangerouslySetInnerHTML={{__html: this.state.article.article_content}}></div>
        </div>
      </div>
    );
  }
}

StoryDetail.propTypes = {};

export default connect(({story}) => ({story}))(StoryDetail);
