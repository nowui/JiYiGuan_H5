export default {

  namespace: 'delivery',

  state: {
    list: []
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
