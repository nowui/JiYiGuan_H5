export default {
  namespace: 'bill',

  state: {
    member_withdraw_amount: 0,
    member_commission_amount: 0,
    member_order_amount: 0,
    bill_list: []
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
