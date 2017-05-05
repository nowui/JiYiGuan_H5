export default {

  namespace: 'my',

  state: {
    member_total_amount: 0,
    WAIT_PAY: 0,
    WAIT_SEND: 0,
    WAIT_RECEIVE: 0
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
