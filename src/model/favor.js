export default {

  namespace: 'favor',

  state: {
    list: []
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
