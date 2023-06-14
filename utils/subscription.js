import { compareVersion } from './index';

/**
 * 请求订阅消息授权
 * @param {String[]} tmplIds 订阅消息模板
 * @returns {Promise<[]>} 已授权模板
 */
const sendSubscribeMessage = (tmplIds) => {
  const deferred = wx.$defer();
  console.log('授权 tmplsId:', tmplIds);
  if (tmplIds.length === 0) {
    deferred.resolve([]);
  } else {
    wx.requestSubscribeMessage({
      tmplIds,
      success(res) {
        console.log('授权结果:', res);
        deferred.resolve(tmplIds.filter(((item) => res[item] === 'accept')));
      },
      fail(err) {
        console.log('授权失败:', err);
        deferred.resolve([]);
      },
    });
  }
  return deferred.promise;
};

/**
 * IOS 大于 7.0.6 版本
 * @param {String} system 系统
 * @param {String} version 版本
 * @returns {Boolean}
 */
const gtIOS706 = (system, version) => /^iOS/.test(system) && compareVersion(version, '7.0.6') > -1;

/**
 * Android 大于 7.0.7 版本
 * @param {String} system 系统
 * @param {String} version 版本
 * @returns {Boolean}
 */
const gtAndroid707 = (system, version) => !/^iOS/.test(system) && compareVersion(version, '7.0.7') > -1;

/**
 * 请求订阅消息授权
 * @param {String[]} tmplIds 订阅消息模板
 * @returns {Promise<[]>} 已授权模板
 */
const requestSubscribeMessage = (tmplIds) => {
  const { system, version } = wx.getSystemInfoSync();
  if (
    !wx.requestSubscribeMessage
    || !(
      gtIOS706(system, version)
      || gtAndroid707(system, version)
    )
  ) {
    return Promise.resolve([]);
  }
  const ids = tmplIds.filter(Boolean);
  return sendSubscribeMessage(ids);
};

export default requestSubscribeMessage;
