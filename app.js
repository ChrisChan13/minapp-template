import install from './utils/install';

App({
  globalData: {},
  onLaunch(options) {
    install(this);
  },
});
