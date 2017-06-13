function delay(timeout){
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export default {

  namespace: 'main',

  state: {
    title: '',
    cart_count: 0
  },

  reducers: {
    fetch(state, action) {
      document.title = action.data.title;
      return { ...state, ...action.data };
    },
    complete(state) {
      return { ...state, title: ''};
    }
  },
  effects: {
    *fetch(action, { call, put }) {
      yield call(delay, 300);
      yield put({ type: 'complete' });
    },
  }

};
