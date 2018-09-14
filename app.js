import sugaring from './utils/sugar/index';
import regeneratorRuntime from './libs/regenerator.runtime.min';

App({
  globalData: {},
  onLaunch(options) {
    sugaring(this);
  },
});
