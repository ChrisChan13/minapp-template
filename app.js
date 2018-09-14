import sugaring from './utils/sugar/index';

App({
  globalData: {},
  onLaunch(options) {
    sugaring(this);
  },
});
