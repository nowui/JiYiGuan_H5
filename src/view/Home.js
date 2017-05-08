import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import style from './style.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category_list: [],
    };
  }

  componentDidMount() {
    this.props.dispatch(routerRedux.push({
      pathname: '/index',
      query: {},
    }));
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <div className={style.page} style={{backgroundColor: '#ffffff'}}>
        </div>
      </div>
    );
  }
}

Home.propTypes = {};

export default connect(({}) => ({}))(Home);
