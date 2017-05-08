export default {

  namespace: 'team',

  state: {
    list: []
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
