import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, Modal} from 'antd-mobile';

import style from './style.css';

const prompt = Modal.prompt;

class Qrcode extends Component {
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
    this.props.dispatch(routerRedux.push({
      pathname: '/story/index',
      query: {}
    }));
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

Qrcode.propTypes = {};

export default connect(({story}) => ({story}))(Qrcode);
