export default {
  namespace: 'bill',

  state: {
    list: []
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
