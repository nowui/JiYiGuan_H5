import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

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

    this.setState({
      article: this.props.science.list[this.props.params.index]
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
        {/*<NavBar*/}
          {/*className={style.header} mode="light" leftContent="返回"*/}
          {/*onLeftClick={this.handleBack.bind(this)}*/}
        {/*>{this.state.article.article_name}</NavBar>*/}
        <div className={style.page}>
          <div className={style.articleContent} dangerouslySetInnerHTML={{__html: this.state.article.article_content}}></div>
        </div>
      </div>
    );
  }
}

ScienceDetail.propTypes = {};

export default connect(({science}) => ({science}))(ScienceDetail);
