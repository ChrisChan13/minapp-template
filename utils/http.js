import Q from '../libs/q.min';
import * as cache from './cache';
import regeneratorRuntime from '../libs/regenerator.runtime.min';

// qiniu configuration
const qiniu = {
  uptokenURL: '',
  uploadURL: '',
  domain: '',
  prefix: '', // could be your appid
};

// http request
const request = (method = 'GET') => async (url, data = {}, header = {}) => {
  const deferred = Q.defer();
  console.info(`Requested(${method}) data to: ${url}`);
  console.log(data);

  const token = (await cache.get('token')) || '';
  Object.assign(header, {
    'Content-Type': 'application/json',
    'X-Token': token,
  });

  wx.request({
    url,
    method,
    header,
    data,
    success(res) {
      console.info(`Responsed data from: ${url}`);
      console.log(res.data);

      if (parseInt(res.statusCode, 10) === 200) deferred.resolve(res.data);
      else deferred.reject(new Error('网络错误'));
    },
    fail(err) {
      console.info(`Responsed error from: ${url}`);
      console.error(err);

      deferred.reject(new Error('网络错误'));
    },
  });
  return deferred.promise;
};

// post & delete & put & get
export const post = request('POST');
export const del = request('DELETE');
export const put = request('PUT');
export const get = request('GET');

// download file from given url
export const download = (url) => {
  const deferred = Q.defer();
  console.info(`Downloading file from: ${url}`);

  wx.downloadFile({
    url,
    success(res) {
      console.info(`Downloaded file from: ${url}`);
      console.log(res);

      deferred.resolve(res);
    },
    fail(err) {
      console.info(`Downloading error from: ${url}`);
      console.error(err);

      deferred.reject(new Error('下载失败'));
    },
  });
  return deferred.promise;
};

// upload file with given local path
export const upload = async (local) => {
  const deferred = Q.defer();
  const regexp = new RegExp(`^${qiniu.domain}`);
  if (regexp.test(`${local}`)) {
    console.info('Uploaded before!');
    console.log(local);

    deferred.resolve(local);
  } else {
    console.info(`Uploading file to: ${qiniu.domain}`);

    const uptoken = await get(qiniu.uptokenURL);
    const time = new Date().getTime();
    const random = `${Math.random()}`;
    const key = `${qiniu.prefix}.${time}.${random.slice(2, 15)}`;
    wx.uploadFile({
      url: qiniu.uploadURL,
      filePath: local,
      name: 'file',
      formData: {
        key,
        token: uptoken,
      },
      success(res) {
        console.info(`Uploaded file to: ${qiniu.domain}`);
        console.log(res);

        const data = JSON.parse(res.data);
        deferred.resolve(`${qiniu.domain}${data.key}`);
      },
      fail(err) {
        console.info(`Uploading error to: ${qiniu.domain}`);
        console.error(err);

        deferred.reject(new Error('上传失败'));
      },
    });
  }
  return deferred.promise;
};
