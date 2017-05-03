import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {NavBar, WhiteSpace, List, Checkbox, Result} from 'antd-mobile';

import constant from '../util/constant';
import database from '../util/database';
import http from '../util/http';
import style from './style.css';

class FavorIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_list: false,
      favor_id: '',
    }
  }

  componentDidMount() {
    // this.handleLoad();
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http({
      url: '/favor/list',
      data: {
        page_index: 1,
        page_size: 10
      },
      success: function (data) {
        this.props.dispatch({
          type: 'favor/fetch',
          data: {
            list: data
          }
        });
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: true
        });
      }.bind(this)
    }).post();
  }

  handleBack() {
    this.props.dispatch(routerRedux.push({
      pathname: '/mine',
      query: {}
    }));
  }

  handleEdit(favor_id) {
    this.props.dispatch(routerRedux.push({
      pathname: '/favor/edit/' + this.props.params.type + '/' + favor_id,
      query: {}
    }));
  }

  handleChange(favor) {
    this.setState({
      favor_id: favor.favor_id
    });

    database.setFavor(favor);

    setTimeout(function () {
      this.handleBack();
    }.bind(this), 300);
  }

  render() {
    const Item = List.Item;
    const CheckboxItem = Checkbox.CheckboxItem;

    return (
      <div>
        <NavBar className={style.header} mode="light" leftContent="返回"
                onLeftClick={this.handleBack.bind(this)}
        >我的收藏</NavBar>
        <div className={style.page}>
          <WhiteSpace size="lg"/>
          <List>
            <Result
              img={<img src={require('../assets/svg/empty.svg')} style={{width: '1.2rem', height: '1.2rem'}}/>}
              message={constant.empty}
            />
          </List>
        </div>
      </div>
    );
  }
}

FavorIndex.propTypes = {};

export default connect(({favor}) => ({favor}))(FavorIndex);
