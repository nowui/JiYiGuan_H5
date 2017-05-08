export default {

  namespace: 'index',

  state: {
    list: [],
    scroll_top: 0,
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
