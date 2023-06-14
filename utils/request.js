/* eslint-disable no-param-reassign */
/**
 * 请求封装
 * @param {String} method 请求方法
 * @returns {Function} Promise 化后的请求
 *
 * ****
 *
 * **Promise 化后的请求**
 * @param {String} path 请求路径
 * @param {Object} data 请求数据
 * @param {Object} header 请求头
 * @returns {Promise} 请求响应结果
 *
 * ****
 *
 * **示例代码**
 * ```js
 * const result = await request('POST')('/api/test', data, header);
 * ```
 */
const request = (method = 'GET') => (path, data = {}, header = {}) => {
  const deferred = wx.$defer();
  // 支持 URL 参数，如：/users/:id
  if (/\/:\w+/.test(path)) {
    path = path.replaceAll(/\/:\w+/g, (param) => {
      const key = param.slice(2);
      const result = data[key] ? `/${data[key]}` : param;
      delete data[key];
      return result;
    });
  }
  const token = wx.getStorageSync('token');
  Object.assign(header, {
    'X-Token': token,
  });
  console.log('request ==>', path, data);
  wx.request({
    url: `${wx.$config.BASE_URL}${path}`,
    data,
    method,
    header,
    success(res) {
      const { data: responseData } = res;
      console.log('response ==>', path, responseData);
      if (res.statusCode === 200) {
        deferred.resolve(responseData);
      } else {
        deferred.reject(responseData);
      }
    },
    fail(err) {
      console.log('error ==>', path, err);
      deferred.reject(err);
    },
  });
  return deferred.promise;
};

export const get = request('GET');
export const post = request('POST');

export default request;
