import React, { Component } from 'react';
import { List, Popup, Stepper } from 'antd-mobile';

import constant from '../util/constant';
import style from './style.css';

class ProductPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product_quantity: this.props.product_quantity,
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleChange(product_quantity) {
    this.setState({
      product_quantity,
    });

    this.props.handleChange(product_quantity);
  }

  handleSubmit() {
    Popup.hide();

    this.props.handleSubmit();
  }

  render() {
    return (
      <div className={style.productPopup}>
        <div className={style.productPopupHeader}>
          <div className={style.productPopupImage}>
            <img className={style.productCardImage} src={constant.host + this.props.product_image} />
          </div>
          <div className={style.productPopupText}>
            <span>{this.props.product_name}</span>
            <br />
            <span className={style.productPopupRedText}>￥{this.props.product_price}</span>
          </div>
        </div>
        <List className={style.productPopupContent}>
          <List.Item
            extra={
              <Stepper
                style={{ width: '100%', minWidth: '2rem' }}
                showNumber={false}
                max={this.props.product_stock}
                min={1}
                defaultValue={this.state.product_quantity}
                onChange={this.handleChange.bind(this)}
                useTouch={!window.isPC}
              />}
          >
            购买数量
          </List.Item>
        </List>
        <div className={style.productPopupQuantity}>
          <div className={style.productPopupQuantityNumber}>{this.state.product_quantity}</div>
        </div>
        <div className={style.productPopupSubmit} onClick={this.handleSubmit.bind(this)}>确定</div>
      </div>
    );
  }
}

ProductPopup.propTypes = {
  product_name: React.PropTypes.string.isRequired,
  product_image: React.PropTypes.string.isRequired,
  product_price: React.PropTypes.number.isRequired,
  product_quantity: React.PropTypes.number.isRequired,
  product_stock: React.PropTypes.number.isRequired,
  handleChange: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
};

ProductPopup.defaultProps = {

};

export default ProductPopup;
