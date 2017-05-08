export default {

  namespace: 'category',

  state: {
    product_list: [],
  },

  reducers: {
    fetch(state, action) {
      return { ...state, ...action.data };
    },
  },

};
