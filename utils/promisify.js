import MinaError from './MinaError';

(() => {
  const destructPayload = (defaults = {}, payload = {}, func) => {
    const params = Object.assign(defaults, payload);
    return func(params);
  };

  const defaultParams = new Map([
    ['showToast', { icon: 'none' }],
    ['showLoading', { mask: true }],
    ['getLocation', { type: 'gcj02' }],
  ]);

  const getSystemInfo = target => payload => destructPayload(
    {}, payload,
    params => new Promise((resolve, reject) => {
      target.getSystemInfo({
        success(res) { resolve({ ...res, scale: res.windowWidth / 750 }); },
        fail(err) { reject(new MinaError({ ...err, errApi: 'getSystemInfo' })); },
        ...params,
      });
    }),
  );

  const request = target => payload => destructPayload(
    {}, payload,
    params => new Promise((resolve, reject) => {
      target.request({
        success(res) {
          if (parseInt(res.statusCode, 10) === 200) resolve(res.data);
          else reject(new MinaError({ ...res.data, errApi: 'request' }));
        },
        fail(err) {
          reject(new MinaError({ ...err, errApi: 'request' }));
        },
        ...params,
      });
    }),
  );

  const downloadFile = target => payload => destructPayload(
    {}, payload,
    params => new Promise((resolve, reject) => {
      target.downloadFile({
        success(res) {
          if (parseInt(res.statusCode, 10) === 200) resolve(res);
          else reject(new MinaError({ ...res, errApi: 'downloadFile' }));
        },
        fail(err) { reject(new MinaError({ ...err, errApi: 'downloadFile' })); },
        ...params,
      });
    }),
  );

  const uploadFile = target => payload => destructPayload(
    {}, payload,
    params => new Promise((resolve, reject) => {
      target.uploadFile({
        success(res) {
          const data = JSON.parse(res.data);
          if (parseInt(res.statusCode, 10) === 200) resolve(data);
          else reject(new MinaError({ ...data, errApi: 'uploadFile' }));
        },
        fail(err) { reject(new MinaError({ ...err, errApi: 'uploadFile' })); },
        ...params,
      });
    }),
  );

  const getStorage = target => payload => destructPayload(
    {}, payload,
    params => new Promise((resolve, reject) => {
      target.getStorage({
        success(res) { resolve(res); },
        fail(err) { resolve(err); },
        ...params,
      });
    }),
  );

  const $ = new Map([
    ['getSystemInfo', getSystemInfo],
    ['request', request],
    ['downloadFile', downloadFile],
    ['uploadFile', uploadFile],
    ['getStorage', getStorage],
  ]);

  global.$ = new Proxy(wx, {
    get: (target, property) => {
      if (!wx.canIUse(`${property}.success`)) return target[property];
      return $.get(property)
        ? $.get(property)(target)
        : payload => destructPayload(
          defaultParams.get(property), payload,
          params => new Promise((resolve, reject) => {
            target[property]({
              success: resolve,
              fail: reject,
              ...params,
            });
          }),
        );
    },
  });
})();
