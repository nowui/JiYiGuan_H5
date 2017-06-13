import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { TabBar } from 'antd-mobile';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      selectedTab: this.props.routes[2].path
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handlePress(tab) {
    this.setState({
      selectedTab: tab,
    });

    this.props.dispatch(routerRedux.push({
      pathname: '/' + tab,
      query: {},
    }));
  }

  render() {
    return (
      <div>
        {
          this.state.title != this.props.main.title ?
            <iframe src=""></iframe>
            :
            ''
        }
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#a72025"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="首页"
            key="index"
            icon={require('../assets/svg/index.svg')}
            selectedIcon={require('../assets/svg/index_active.svg')}
            selected={this.state.selectedTab === 'index'}
            onPress={this.handlePress.bind(this, 'index')}
          />
          <TabBar.Item
            title="购物车"
            key="cart"
            badge={this.props.main.cart_count}
            icon={require('../assets/svg/cart.svg')}
            selectedIcon={require('../assets/svg/cart_active.svg')}
            selected={this.state.selectedTab === 'cart'}
            onPress={this.handlePress.bind(this, 'cart')}
          />
          <TabBar.Item
            title="个人"
            key="my"
            icon={require('../assets/svg/my.svg')}
            selectedIcon={require('../assets/svg/my_active.svg')}
            selected={this.state.selectedTab === 'my'}
            onPress={this.handlePress.bind(this, 'my')}
          />
        </TabBar>
        {this.props.children}
      </div>
    );
  }
}

Main.propTypes = {};

export default connect(({main}) => ({main}))(Main);
