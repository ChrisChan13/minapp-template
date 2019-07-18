export default () => {
  const { Q, regeneratorRuntime, MinaError } = global;
  const $wx = Object.assign({}, { ...wx });

  const isInvalidString = str => str === '' || str === null || str === undefined || Number.isNaN(str);

  const destructPayload = (defaults = {}, payload = {}, next) => {
    const params = Object.assign(defaults, payload);
    return next(params);
  };

  return {
    login: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.login({
        success(res) {
          if (res.code) deferred.resolve(res.code);
          else deferred.reject(new MinaError({ ...res, errHint: '微信登录失败' }));
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '微信登录失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    getSystemInfo: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.getSystemInfo({
        success(res) {
          const sysInfo = Object.assign({}, { ...res, scale: res.windowWidth / 750 });
          deferred.resolve(sysInfo);
        },
        fail(err) {
          deferred.reject(new MinaError(err));
        },
        ...params,
      });
      return deferred.promise;
    }),
    showToast: payload => destructPayload({ icon: 'none' }, payload, (params) => {
      if (isInvalidString(params.title)) return;
      $wx.showToast({ ...params });
    }),
    showModal: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.showModal({
        success(res) {
          deferred.resolve(res.confirm);
        },
        fail(err) {
          deferred.reject(new MinaError(err));
        },
        ...params,
      });
      return deferred.promise;
    }),
    getSetting: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.getSetting({
        success(res) {
          // const scopes = {};
          // Object.entries(res.authSetting).map((setting) => {
          //   Object.assign(scopes, {
          //     [`${setting[0].slice(6)}`]: setting[1],
          //   });
          //   return setting;
          // });
          // deferred.resolve(scopes);
          deferred.resolve(res.authSetting);
        },
        fail(err) {
          deferred.reject(new MinaError(err));
        },
        ...params,
      });
      return deferred.promise;
    }),
    getLocation: payload => destructPayload({ type: 'gcj02' }, payload, (params) => {
      const deferred = Q.defer();
      $wx.getLocation({
        success(res) {
          deferred.resolve(res);
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '获取地理位置信息失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    chooseImage: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.chooseImage({
        success(res) {
          deferred.resolve(res.tempFilePaths);
        },
        fail(err) {
          deferred.reject({ ...err, errHint: '取消图片选择' });
        },
        ...params,
      });
      return deferred.promise;
    }),
    chooseLocation: payload => destructPayload({ strict: true }, payload, (params) => {
      const deferred = Q.defer();
      $wx.chooseLocation({
        success(res) {
          if (params.strict && (res.name === '' || res.address === '')) deferred.reject({ errHint: '请选择正确地址' });
          else deferred.resolve(res);
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '取消地址选择' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    authorize: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.authorize({
        success() {
          deferred.resolve();
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '获取授权信息失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    getImageInfo: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.getImageInfo({
        success(res) {
          deferred.resolve(res);
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '获取图片信息失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    saveImageToPhotosAlbum: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.saveImageToPhotosAlbum({
        success() {
          deferred.resolve();
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '保存图片失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    showLoading: payload => destructPayload({ mask: true }, payload, (params) => {
      $wx.showLoading({ ...params });
    }),
    showActionSheet: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.showActionSheet({
        success(res) {
          deferred.resolve(res.tapIndex);
        },
        fail(err) {
          deferred.resolve(-1);
        },
        ...params,
      });
      return deferred.promise;
    }),
    getUserInfo: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.getUserInfo({
        success(res) {
          deferred.resolve(res);
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '获取用户信息失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    requestPayment: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.requestPayment({
        success() {
          deferred.resolve();
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '支付失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    saveVideoToPhotosAlbum: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.saveVideoToPhotosAlbum({
        success() {
          deferred.resolve();
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '保存视频失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    chooseVideo: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.chooseVideo({
        success(res) {
          deferred.resolve(res.tempFilePath);
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '取消视频选择' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    getShareInfo: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.getShareInfo({
        success(res) { deferred.resolve(res); },
        fail(err) { deferred.reject(new MinaError(err)); },
        ...params,
      });
      return deferred.promise;
    }),
    saveFile: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.saveFile({
        success(res) { deferred.resolve(res.savedFilePath); },
        fail(err) { deferred.reject(new MinaError(err)); },
        ...params,
      });
      return deferred.promise;
    }),
    getFileInfo: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.getFileInfo({
        success(res) { deferred.resolve(res); },
        fail(err) { deferred.reject(new MinaError({ ...err, errHint: '获取文件信息失败' })); },
        ...params,
      });
      return deferred.promise;
    }),
    request: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.request({
        success(res) {
          if (parseInt(res.statusCode, 10) === 200) deferred.resolve(res.data);
          else deferred.reject(res.data);
        },
        fail(err) {
          deferred.reject(new MinaError(err));
        },
        ...params,
      });
      return deferred.promise;
    }),
    downloadFile: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.downloadFile({
        success(res) {
          if (parseInt(res.statusCode, 10) === 200) deferred.resolve(res);
          else deferred.reject(new MinaError(res));
        },
        fail(err) {
          deferred.reject(new MinaError(err));
        },
        ...params,
      });
      return deferred.promise;
    }),
    uploadFile: payload => destructPayload({}, payload, async (params) => {
      const deferred = Q.defer();
      $wx.uploadFile({
        success(res) {
          const data = JSON.parse(res.data);
          if (parseInt(res.statusCode, 10) === 200) deferred.resolve(data);
          else deferred.reject(new MinaError(data));
        },
        fail(err) {
          deferred.reject(new MinaError(err));
        },
        ...params,
      });
      return deferred.promise;
    }),
    setStorage: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.setStorage({
        success() {
          deferred.resolve();
        },
        fail(err) {
          deferred.reject(new MinaError(err));
        },
        ...params,
      });
      return deferred.promise;
    }),
    getStorage: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.getStorage({
        success(res) {
          deferred.resolve(res.data);
        },
        fail() {
          deferred.resolve();
        },
        ...params,
      });
      return deferred.promise;
    }),
    removeStorage: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.removeStorage({
        success() {
          deferred.resolve();
        },
        fail(err) {
          deferred.reject(new MinaError(err));
        },
        ...params,
      });
      return deferred.promise;
    }),
    clearStorage: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.clearStorage({
        success() {
          deferred.resolve();
        },
        fail(err) {
          deferred.reject(new MinaError(err));
        },
        ...params,
      });
      return deferred.promise;
    }),
    compressImage: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.compressImage({
        success(res) {
          deferred.resolve(res.tempFilePath);
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '图片压缩失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    checkSession: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.checkSession({
        success() {
          deferred.resolve(true);
        },
        fail(err) {
          deferred.reject({ ...err, errHint: '微信登录态过期' });
        },
        ...params,
      });
      return deferred.promise;
    }),
    chooseAddress: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.chooseAddress({
        success(res) {
          deferred.resolve(res);
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '取消地址选择' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    getWeRunData: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.getWeRunData({
        success(res) {
          deferred.resolve(res);
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '获取微信运动步数失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
    getBatteryInfo: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.getBatteryInfo({
        success(res) { deferred.resolve(res); },
        fail(err) { deferred.reject(new MinaError(err)); },
        ...params,
      });
      return deferred.promise;
    }),
    setClipboardData: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.setClipboardData({
        success() { deferred.resolve(); },
        fail(err) { deferred.reject(new MinaError({ ...err, errHint: '复制失败' })); },
        ...params,
      });
      return deferred.promise;
    }),
    getClipboardData: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.getClipboardData({
        success(res) { deferred.resolve(res.data); },
        fail(err) { deferred.reject(new MinaError(err)); },
        ...params,
      });
      return deferred.promise;
    }),
    scanCode: payload => destructPayload({}, payload, (params) => {
      const deferred = Q.defer();
      $wx.scanCode({
        success(res) {
          deferred.resolve(res);
        },
        fail(err) {
          deferred.reject(new MinaError({ ...err, errHint: '扫码失败' }));
        },
        ...params,
      });
      return deferred.promise;
    }),
  };
};
