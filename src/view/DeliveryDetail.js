import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';

import { Toast, Modal, NavBar, WhiteSpace, List, InputItem, Picker, Switch, Button } from 'antd-mobile';

import constant from '../util/constant';
import validate from '../util/validate';
import china from '../util/china';
import http from '../util/http';
import style from './style.css';

class DeliveryDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    document.body.scrollTop = 0;

    if (this.props.route.path.indexOf('/edit/') > -1) {
      this.handleLoad();
    } else {

    }
  }

  componentWillUnmount() {

  }

  handleLoad() {
    http.request({
      url: '/delivery/find',
      data: {
        delivery_id: this.props.params.delivery_id,
      },
      success: function (data) {
        data.delivery_province_city_area = [data.delivery_province, data.delivery_city, data.delivery_area];

        this.props.form.setFieldsValue(data);
      }.bind(this),
      complete() {

      },
    });
  }

  handleBack() {
    this.props.dispatch(routerRedux.push({
      pathname: '/delivery/index/' + this.props.params.type,
      query: {},
    }));
  }

  handleDelete() {
    Modal.alert('删除', '确定删除么?', [
      {
        text: '取消',
        onPress() {

        },
      },
      {
        text: '确定',
        style: { fontWeight: 'bold' },
        onPress: function () {
          http.request({
            url: '/delivery/delete',
            data: {
              delivery_id: this.props.params.delivery_id,
            },
            success: function (data) {
              Toast.success('删除成功', constant.duration);

              setTimeout(() => {
                this.handleBack();
              }, constant.timeout);
            }.bind(this),
            complete() {

            },
          });
        }.bind(this),
      },
    ]);
  }

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        if (!validate.isPhone(values.delivery_phone)) {
          Toast.fail('手机号码格式不对', constant.duration);

          return;
        }

        if (values.delivery_province_city_area.length == 0) {
          Toast.fail('请选择省市区', constant.duration);

          return;
        }

        values.delivery_province = values.delivery_province_city_area[0];
        values.delivery_city = values.delivery_province_city_area[1];
        values.delivery_area = values.delivery_province_city_area[2];

        var province = '';
        var city = '';
        var area = '';
        var cityList = [];
        var areaList = [];

        for (var i = 0; i < china.length; i++) {
          if (china[i].value == values.delivery_province) {
            province = china[i].label;

            cityList = china[i].children;

            break;
          }
        }

        for (var i = 0; i < cityList.length; i++) {
          if (cityList[i].value == values.delivery_city) {
            city = cityList[i].label;

            areaList = cityList[i].children;

            break;
          }
        }

        for (var i = 0; i < areaList.length; i++) {
          if (areaList[i].value == values.delivery_area) {
            area = areaList[i].label;

            break;
          }
        }

        values.delivery_address = province + city + area + values.delivery_street;

        var action = 'save';
        if (this.props.route.path.indexOf('/edit/') > -1) {
          action = 'update';

          values.delivery_id = this.props.params.delivery_id;
        }

        http.request({
          url: '/delivery/' + action,
          data: values,
          success: function (data) {
            Toast.success('保存成功', constant.duration);

            setTimeout(() => {
              this.handleBack();
            }, constant.timeout);
          }.bind(this),
          complete() {

          },
        });
      }
    });
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const rightContent = this.props.route.path.indexOf('/edit/') > -1 ? [<div
      onClick={this.handleDelete.bind(this)}
      key="add"
    >删除</div>] : [];

    return (
      <div>
        <NavBar
          className={style.header} mode="light" leftContent="返回"
          onLeftClick={this.handleBack.bind(this)}
          rightContent={rightContent}
        >我的地址</NavBar>
        <div className={style.page}>
          <WhiteSpace size="lg" />
          <List>
            <InputItem
              {...getFieldProps('delivery_name', {
                rules: [{
                  required: true,
                  message: '请输入收货人',
                }],
                initialValue: '',
              })}
              error={!!getFieldError('delivery_name')}
              clear
              placeholder="请输入收货人"
            >收货人:</InputItem>
            <InputItem
              {...getFieldProps('delivery_phone', {
                rules: [{
                  required: true,
                  message: '请输入手机号码',
                }],
                initialValue: '',
              })}
              error={!!getFieldError('delivery_phone')}
              clear
              placeholder="请输入手机号码"
            >手机号码:</InputItem>
            <Picker
              data={china} {...getFieldProps('delivery_province_city_area', {
                initialValue: [],
              })}
            >
              <List.Item arrow="horizontal">省市区:</List.Item>
            </Picker>
            <InputItem
              {...getFieldProps('delivery_street', {
                rules: [{
                  required: true,
                  message: '请输入详细地址',
                }],
                initialValue: '',
              })}
              error={!!getFieldError('delivery_street')}
              clear
              placeholder="请输入详细地址"
            >详细地址:</InputItem>
          </List>
          <WhiteSpace size="lg" />
          <List>
            <List.Item
              extra={<Switch
                {...getFieldProps('delivery_is_default', {
                  valuePropName: 'checked',
                  initialValue: true,
                })}
              />}
            >设为默认地址</List.Item>
          </List>
          <div style={{ margin: '50px 10px 0px 10px' }}>
            <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
          </div>
        </div>
      </div>
    );
  }
}

DeliveryDetail.propTypes = {};

DeliveryDetail = createForm()(DeliveryDetail);

export default connect(({}) => ({}))(DeliveryDetail);
