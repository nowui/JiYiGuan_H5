export default {

  namespace: 'science',

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
