import constant from '../util/constant';

export default {

  namespace: 'favor',

  state: {
    is_load: false,
    list: [],
    total: 0,
    page_index: 1,
    page_size: constant.page_size,
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
