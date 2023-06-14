/**
 * WX API promise 化
 * @param {String} key WX API 名称
 * @returns {Function} Promise 化后的 WX API
 *
 * ****
 *
 * **Promise 化后的 WX API**
 * @param {*[]} arguments 原 WX API 所需参数
 * @returns {Promise} WX API 执行结果
 *
 * ****
 *
 * **示例代码**
 * ```js
 * const { confirm } = await wx.$('showModal')({
 *   title: '更新提示',
 *   content: '新版本已经准备好，是否重启应用？',
 * });
 * if (confirm) {
 *   // 这里书写相关逻辑
 * }
 * ```
 */
const promisify = (key) => {
  const api = Reflect.get(wx, key);
  if (!api) {
    throw new ReferenceError(`wx.${key} is not defined`);
  }
  // api 是否包含回调
  // requestPayment.success 在低基础库版本（<= 2.7.2）的 wx.canIUse 中存在 BUG（返回 false）
  if (!wx.canIUse(`${key}.success`) && key !== 'requestPayment') return api;
  return (...args) => new Promise((resolve, reject) => {
    const [params = {}, ...rest] = args;
    Reflect.apply(api, undefined, [{
      ...(params),
      success: resolve,
      fail: reject,
    }, ...rest]);
  });
};

export default promisify;
