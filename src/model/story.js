export default {

  namespace: 'story',

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
