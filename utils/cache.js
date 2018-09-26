import Q from '../libs/q.min';

// set storage
export const set = (key, data) => {
  const deferred = Q.defer();
  wx.setStorage({
    key,
    data,
    success() {
      deferred.resolve();
    },
    fail() {
      deferred.reject();
    },
  });
  return deferred.promise;
};

// get storage
export const get = (key) => {
  const deferred = Q.defer();
  wx.getStorage({
    key,
    success(res) {
      deferred.resolve(res.data);
    },
    fail() {
      deferred.resolve();
    },
  });
  return deferred.promise;
};

// delete storage
export const del = (key) => {
  const deferred = Q.defer();
  wx.removeStorage({
    key,
    success() {
      deferred.resolve();
    },
    fail() {
      deferred.reject();
    },
  });
  return deferred.promise;
};

// clear storage
export const clear = () => {
  const deferred = Q.defer();
  wx.clearStorage({
    success() {
      deferred.resolve();
    },
    fail() {
      deferred.reject();
    },
  });
  return deferred.promise;
};
