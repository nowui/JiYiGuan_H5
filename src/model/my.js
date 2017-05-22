export default {

  namespace: 'my',

  state: {
    user_name: '',
    user_avatar: '',
    member_level_id: '',
    member_level_name: '',
    member_level_value: 999,
    member_total_amount: 0,
    member_status: false,
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
