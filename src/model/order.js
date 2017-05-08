export default {

  namespace: 'order',

  state: {
    list: []
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
