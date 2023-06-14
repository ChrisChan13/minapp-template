import { createStore, setState } from '../libs/store';

const state = {
  userInfo: {},
};

const mutation = {
  setUserInfo(userInfo) {
    setState({ userInfo });
  },
};

export default createStore({
  state, mutation,
});
