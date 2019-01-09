import install from './utils/install';

require('./utils/sdk');

App({
  globalData: {},
  onLaunch(options) {
    install(this);
  },
});
