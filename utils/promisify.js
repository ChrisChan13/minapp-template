import MinaError from './MinaError';

const $wx = wx;

const destructPayload = (defaults = {}, payload = {}, func) => {
  const params = Object.assign(defaults, payload);
  return func(params);
};

const defaultParams = new Map([
  ['showToast', { icon: 'none' }],
  ['showLoading', { mask: true }],
  ['getLocation', { type: 'gcj02' }],
  ['showLoading', { mask: true }],
]);

const promisify = (prop) => {
  const isFunc = $wx.canIUse(`${prop}.success`);
  if (!isFunc) return $wx[prop];
  return payload => destructPayload(
    defaultParams.get(prop), payload,
    params => new Promise((resolve, reject) => {
      $wx[prop]({
        success(res) { resolve(res); },
        fail(err) { reject(new MinaError({ ...err, errApi: prop })); },
        ...params,
      });
    }),
  );
};

const getSystemInfo = payload => destructPayload(
  {}, payload,
  params => new Promise((resolve, reject) => {
    $wx.getSystemInfo({
      success(res) { resolve({ ...res, scale: res.windowWidth / 375 }); },
      fail(err) { reject(new MinaError({ ...err, errApi: 'getSystemInfo' })); },
      ...params,
    });
  }),
);

const request = payload => destructPayload(
  {}, payload,
  params => new Promise((resolve, reject) => {
    $wx.request({
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

const downloadFile = payload => destructPayload(
  {}, payload,
  params => new Promise((resolve, reject) => {
    $wx.downloadFile({
      success(res) {
        if (parseInt(res.statusCode, 10) === 200) resolve(res);
        else reject(new MinaError({ ...res, errApi: 'downloadFile' }));
      },
      fail(err) { reject(new MinaError({ ...err, errApi: 'downloadFile' })); },
      ...params,
    });
  }),
);

const uploadFile = payload => destructPayload(
  {}, payload,
  params => new Promise((resolve, reject) => {
    $wx.uploadFile({
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

const getStorage = payload => destructPayload(
  {}, payload,
  params => new Promise((resolve, reject) => {
    $wx.getStorage({
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

export default (() => {
  const promisifyWX = {};
  Object.keys($wx).map((prop) => {
    Object.assign(promisifyWX, { [prop]: $.get(prop) || promisify(prop) });
    return prop;
  });
  wx = Object.assign({}, $wx, promisifyWX);
})();
