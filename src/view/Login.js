import React, {Component} from 'react';
import {createForm} from 'rc-form';
import {Toast, NavBar, List, InputItem, Button, Popup} from 'antd-mobile';

import constant from '../util/constant';
import database from '../util/database';
import http from '../util/http';
import style from './style.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleClose() {
    Popup.hide();
  }

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        values.type = this.props.type;
        values.data = this.props.data;

        http({
          url: '/member/login',
          data: values,
          success: function (data) {
            Toast.success('登录成功', constant.duration);

            database.setToken(data.token);
            database.setDelivery(data.delivery);
            database.setUserName(data.user_name);
            database.setUserAvatar(data.user_avatar);

            setTimeout(function () {
              this.props.handleLoginSucess();

              Popup.hide();
            }.bind(this), constant.timeout);
          }.bind(this),
          complete: function () {

          }.bind(this)
        }).post();
      }
    });
  }

  render() {
    const {getFieldProps, getFieldError} = this.props.form;

    return (
      <div>
        <NavBar className={style.header} mode="light" iconName={false}
                rightContent={[<div onClick={this.handleClose.bind(this)} key='close'>关闭</div>]}>用户登录</NavBar>
        <div className={style.login}>
          <form style={{margin: '50px 10px 0px 10px'}}>
            <List>
              <InputItem
                {...getFieldProps('user_phone', {
                  rules: [{
                    required: true,
                    message: '请输入帐号'
                  }],
                  initialValue: ''
                })}
                error={!!getFieldError('user_phone')}
                clear
                placeholder="请输入帐号"
              >帐号</InputItem>
              <InputItem
                {...getFieldProps('user_password', {
                  rules: [{
                    required: true,
                    message: '请输入密码'
                  }],
                  initialValue: ''
                })}
                error={!!getFieldError('user_password')}
                clear
                placeholder="请输入密码"
                type="password"
              >密码</InputItem>
            </List>
          </form>
          <div style={{margin: '50px 10px 0px 10px'}}>
            <Button type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
          </div>
          {/*<div style={{margin: '20px 10px 0px 10px'}}>*/}
          {/*<div style={{textAlign: 'right'}} onClick={this.handleRegister.bind(this)}>免费注册</div>*/}
          {/*</div>*/}
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  type: React.PropTypes.string,
  data: React.PropTypes.string,
  handleLoginSucess: React.PropTypes.func.isRequired
};

Login.defaultProps = {
  type: 'NORMAL',
  data: ''
};

Login = createForm()(Login);

export default Login;
