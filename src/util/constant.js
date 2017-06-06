export default {
  timeout: 1200,
  duration: 1.2,
  load: '正在加载中..',
  success: '操作成功',
  error: '网络有问题',
  required: '不能为空',
  placeholder: '请输入',
  empty: '当前没有数据',
  platform: 'H5',
  version: '1.0.2',
  // is_developer: true,
  is_developer: false,
  // host: 'http://localhost:8080',
  host: 'http://api.jiyiguan.nowui.com',
  category_list: [{
    category_id: '0',
    category_name: '所有商品',
    category_color: '#fd666b',
    category_image: 'apps.svg',
  }, {
    category_id: '146474b15ba545d9b9717cf8b5a6c3f5',
    category_name: '肠内营养',
    category_color: '#73b4ef',
    category_image: 'discover.svg',
  }, {
    category_id: '9ed6cb3551fb4bfaabfeee89cc63f9b4',
    category_name: '快康系列',
    category_color: '#e78ab0',
    category_image: 'ticket.svg',
  }, {
    category_id: '34fb354194e0409e8a80a4382a7fa18d',
    category_name: '特殊奶粉',
    category_color: '#7acfa6',
    category_image: 'present.svg',
  }, {
    category_id: '26ef74aa1bb242479df5305478f31b08',
    category_name: '理疗辅助',
    category_color: '#ffcb63',
    category_image: 'punch.svg',
  }, {
    category_id: '45ac41e5c3334439a6ac45abdea31a30',
    category_name: '补血系列',
    category_color: '#9f8bea',
    category_image: 'shop.svg',
  }],
  order_status_list: [{
    order_status_value: 'ALL',
    order_status_name: '全部订单',
    order_status_image: ''
  }, {
    order_status_value: 'WAIT_PAY',
    order_status_name: '待付款',
    order_status_image: '/image/pay.svg'
  }, {
    order_status_value: 'WAIT_SEND',
    order_status_name: '待发货',
    order_status_image: '/image/send.svg'
  }, {
    order_status_value: 'WAIT_RECEIVE',
    order_status_name: '待收货',
    order_status_image: '/image/deliver.svg'
  }, {
    order_status_value: 'FINISH',
    order_status_name: '已完成',
    order_status_image: '/image/comment.svg'
  }]
};
