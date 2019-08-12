import MinaError from './MinaError';

const promisify = (
  target, property, defaults = {}, args = [],
) => new Promise((resolve, reject) => {
  const [params = {}, ...rest] = args;
  target[property]({
    ...defaults,
    ...params,
    success: resolve,
    fail: reject,
  }, ...rest);
});

const defaultParams = new Map([
  ['showToast', { icon: 'none' }],
  ['showLoading', { mask: true }],
  ['getLocation', { type: 'gcj02' }],
]);

const getSystemInfo = target => (...args) => promisify(target, 'getSystemInfo', {}, args)
  .then(res => Promise.resolve({ ...res, scale: res.windowWidth / 750 }))
  .catch(err => Promise.reject(new MinaError({ ...err, errApi: 'getSystemInfo' })));

const request = target => (...args) => promisify(target, 'request', {}, args)
  .then(res => (parseInt(res.statusCode, 10) === 200
    ? Promise.resolve(res)
    : Promise.reject(new MinaError({ ...res.data, errApi: 'request' }))))
  .catch(err => Promise.reject(new MinaError({ ...err, errApi: 'request' })));

const downloadFile = target => (...args) => promisify(target, 'downloadFile', {}, args)
  .then(res => (parseInt(res.statusCode, 10) === 200
    ? Promise.resolve(res)
    : Promise.reject(new MinaError({ ...res.data, errApi: 'downloadFile' }))))
  .catch(err => Promise.reject(new MinaError({ ...err, errApi: 'downloadFile' })));

const uploadFile = target => (...args) => promisify(target, 'uploadFile', {}, args)
  // eslint-disable-next-line
  .then(res => (
    // eslint-disable-next-line
    res.data = JSON.parse(res.data),
    parseInt(res.statusCode, 10) === 200
      ? Promise.resolve(res)
      : Promise.reject(new MinaError({ ...res.data, errApi: 'uploadFile' }))))
  .catch(err => Promise.reject(new MinaError({ ...err, errApi: 'uploadFile' })));

const getStorage = target => (...args) => promisify(target, 'getStorage', {}, args)
  .then(res => Promise.resolve(res))
  .catch(err => Promise.resolve(err));

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
      : (...args) => promisify(target, property, defaultParams.get(property), args)
        .then(res => Promise.resolve(res))
        .catch(err => Promise.reject(new MinaError({ ...err, errApi: property })));
  },
});
