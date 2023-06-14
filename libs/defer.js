/**
 * 简易 promise/defer 模型
 *
 * **示例代码**
 *
 * ```js
 * // 封装
 * const yourDeferredFunction = () => {
 *   const deferred = defer();
 *   const yourCallbackFunction = (error, result) => {
 *     if (error) { // 报错逻辑
 *       deferred.reject(error);
 *     } else { // 正常逻辑
 *       deferred.resolve(result);
 *     }
 *   };
 *   yourAsyncFunction(yourCallbackFunction);
 *   return deferred.promise;
 * };
 *
 * // 调用
 * try {
 *   const result = await yourDeferredFunction();
 *   // 书写正常逻辑
 * } catch (err) {
 *   // 书写报错逻辑
 * }
 * ```
 */
const defer = () => {
  const deferred = {};
  Object.assign(deferred, {
    promise: new Promise((resolve, reject) => {
      Object.assign(deferred, {
        resolve, reject,
      });
    }),
  });
  return deferred;
};

export default defer;
