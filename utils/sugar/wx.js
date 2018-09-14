import Q from '../../libs/q.min';

// destruct params
const destructPayload = (defaults = {}, payload = {}, next) => {
  const params = Object.assign(defaults, (() => {
    const temp = Object.assign({}, payload);
    delete temp.success;
    delete temp.fail;
    delete temp.complete;
    return temp;
  })());
  return next(params);
};

export const login = () => {
  const deferred = Q.defer();
  wx.login({
    success(res) {
      if (res.code) {
        deferred.resolve(res.code);
      } else {
        deferred.reject(new Error('微信登录失败'));
      }
    },
    fail(err) {
      deferred.reject(new Error('微信登录失败'));
    },
  });
  return deferred.promise;
};

export const getSystemInfo = () => {
  const deferred = Q.defer();
  wx.getSystemInfo({
    success(res) {
      const sysInfo = Object.assign({}, { scale: res.windowWidth / 750, ...res });
      deferred.resolve(sysInfo);
    },
    fail() {
      deferred.reject(new Error('获取系统信息失败'));
    },
  });
  return deferred.promise;
};

export const showToast = payload => destructPayload({
  title: '',
  duration: 1500,
  mask: false,
  icon: 'none',
}, payload, (params) => {
  wx.showToast({ ...params });
});

export const showModal = payload => destructPayload({
  title: '',
  content: '',
  showCancel: true,
  cancelText: '取消',
  cancelColor: '#000000',
  confirmText: '确定',
  confirmColor: '#3CC51F',
}, payload, (params) => {
  const deferred = Q.defer();
  wx.showModal({
    ...params,
    success(res) {
      if (res.confirm) {
        deferred.resolve();
      } else {
        deferred.reject();
      }
    },
  });
  return deferred.promise;
});

export const getScope = () => {
  const deferred = Q.defer();
  wx.getSetting({
    success(res) {
      const scope = {};
      Object.entries(res.authSetting).map((setting) => {
        Object.assign(scope, {
          [`${setting[0].slice(6)}`]: setting[1],
        });
        return setting;
      });
      deferred.resolve(scope);
    },
    fail() {
      deferred.reject(new Error('获取授权信息失败'));
    },
  });
  return deferred.promise;
};

export const getLocation = () => {
  const deferred = Q.defer();
  wx.getLocation({
    type: 'gcj02',
    success(res) {
      deferred.resolve({
        latitude: res.latitude,
        longitude: res.longitude,
      });
    },
    fail() {
      deferred.reject(new Error('获取位置信息失败'));
    },
  });
  return deferred.promise;
};

export const chooseImage = payload => destructPayload({
  count: 9,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
}, payload, (params) => {
  const deferred = Q.defer();
  wx.chooseImage({
    ...params,
    success(res) {
      deferred.resolve(res.tempFilePaths);
    },
    fail() {
      deferred.reject();
    },
  });
  return deferred.promise;
});

export const previewImage = payload => destructPayload({
  urls: [],
  current: '',
}, payload, (params) => {
  wx.previewImage({
    ...params,
  });
});

export const chooseLocation = () => {
  const deferred = Q.defer();
  wx.chooseLocation({
    success(res) {
      if (res.name === '' || res.address === '') {
        deferred.reject(new Error('请选择正确地址'));
      } else {
        deferred.resolve(res);
      }
    },
    fail() {
      deferred.reject();
    },
  });
  return deferred.promise;
};

export const authorize = payload => destructPayload({
  scope: '',
}, payload, (params) => {
  const deferred = Q.defer();
  wx.authorize({
    ...params,
    success() {
      deferred.resolve();
    },
    fail() {
      deferred.reject(new Error('获取授权信息失败'));
    },
  });
  return deferred.promise;
});

export const getImageInfo = payload => destructPayload({
  src: '',
}, payload, (params) => {
  const deferred = Q.defer();
  wx.getImageInfo({
    ...params,
    success(res) {
      deferred.resolve(res);
    },
    fail() {
      deferred.reject(new Error('获取图片信息失败'));
    },
  });
  return deferred.promise;
});

export const saveImageToPhotosAlbum = payload => destructPayload({
  filePath: '',
}, payload, (params) => {
  const deferred = Q.defer();
  wx.saveImageToPhotosAlbum({
    ...params,
    success(res) {
      deferred.resolve();
    },
    fail() {
      deferred.reject(new Error('图片保存失败'));
    },
  });
  return deferred.promise;
});

export const openLocation = payload => destructPayload({
  latitude: 0,
  longitude: 0,
  scale: 28,
}, payload, (params) => {
  wx.openLocation({ ...params });
});

export const makePhoneCall = payload => destructPayload({
  phoneNumber: '',
}, payload, (params) => {
  wx.makePhoneCall({ ...params });
});

export const showLoading = payload => destructPayload({
  title: '',
  mask: false,
}, payload, (params) => {
  wx.showLoading({ ...params });
});

export const hideLoading = () => {
  wx.hideLoading();
};

export const showActionSheet = payload => destructPayload({
  itemList: [],
  itemColor: '#000000',
}, payload, (params) => {
  const deferred = Q.defer();
  wx.showActionSheet({
    ...params,
    success(res) {
      deferred.resolve(res.tapIndex);
    },
    fail() {
      deferred.reject();
    },
  });
  return deferred.promise;
});

export const setTabBarBadge = payload => destructPayload({
  index: 0,
  text: '',
}, payload, (params) => {
  wx.setTabBarBadge({ ...params });
});

export const removeTabBarBadge = payload => destructPayload({
  index: 0,
}, payload, (params) => {
  wx.removeTabBarBadge({ ...params });
});

export const showTabBarRedDot = payload => destructPayload({
  index: 0,
}, payload, (params) => {
  wx.showTabBarRedDot({ ...params });
});

export const hideTabBarRedDot = payload => destructPayload({
  index: 0,
}, payload, (params) => {
  wx.hideTabBarRedDot({ ...params });
});

export const setNavigationBarTitle = payload => destructPayload({
  title: '',
}, payload, (params) => {
  wx.setNavigationBarTitle({ ...params });
});

export const showNavigationBarLoading = () => {
  wx.showNavigationBarLoading();
};

export const hideNavigationBarLoading = () => {
  wx.hideNavigationBarLoading();
};

export const setNavigationBarColor = payload => destructPayload({
  frontColor: '#000000',
  backgroundColor: '#FFFFFF',
  animation: {
    duration: 0,
    timingFunc: 'linear',
  },
}, payload, (params) => {
  wx.setNavigationBarColor({ ...params });
});

export const getUserInfo = () => {
  const deferred = Q.defer();
  wx.getUserInfo({
    success(res) {
      deferred.resolve(res);
    },
    fail() {
      deferred.reject(new Error('获取用户信息失败'));
    },
  });
  return deferred.promise;
};
