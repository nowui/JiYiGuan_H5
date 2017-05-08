import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { TabBar } from 'antd-mobile';

import storage from '../util/storage';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: this.props.routes[2].path,
      cart_count: storage.getCart().length,
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

  handlCart() {
    this.setState({
      cart_count: storage.getCart().length,
    });
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      child => React.cloneElement(child, {
        handlCart: this.handlCart.bind(this),
      }),
    );

    return (
      <div>
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
            badge={this.state.cart_count}
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
        {childrenWithProps}
      </div>
    );
  }
}

Main.propTypes = {};

export default connect(() => ({}))(Main);
