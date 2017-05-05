import constant from '../util/constant';

export default {

  namespace: 'home',

  state: {
    is_load: false,
    list: [],
    total: 0,
    page_index: 1,
    page_size: constant.page_size,
    scroll_top: 0,
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
