import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {TabBar} from 'antd-mobile';

import database from '../util/database';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: this.props.routes[2].path,
      cart_count: database.getCartList().length
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handlePress(tab) {
    this.setState({
      selectedTab: tab
    });

    this.props.dispatch(routerRedux.push({
      pathname: '/' + tab,
      query: {}
    }));
  }

  handlCart() {
    this.setState({
      cart_count: database.getCartList().length
    });
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        handlCart: this.handlCart.bind(this)
      })
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
            key="home"
            icon={require('../assets/svg/home.svg')}
            selectedIcon={require('../assets/svg/home_active.svg')}
            selected={this.state.selectedTab === 'home'}
            onPress={this.handlePress.bind(this, 'home')}
          >
          </TabBar.Item>
          <TabBar.Item
            title="购物车"
            key="cart"
            badge={this.state.cart_count}
            icon={require('../assets/svg/cart.svg')}
            selectedIcon={require('../assets/svg/cart_active.svg')}
            selected={this.state.selectedTab === 'cart'}
            onPress={this.handlePress.bind(this, 'cart')}
          >
          </TabBar.Item>
          <TabBar.Item
            title="个人"
            key="mine"
            icon={require('../assets/svg/mine.svg')}
            selectedIcon={require('../assets/svg/mine_active.svg')}
            selected={this.state.selectedTab === 'mine'}
            onPress={this.handlePress.bind(this, 'mine')}
          >
          </TabBar.Item>
        </TabBar>
        {childrenWithProps}
      </div>
    );
  }
}

Main.propTypes = {};

export default connect(({}) => ({}))(Main);
