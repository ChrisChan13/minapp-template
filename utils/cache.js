/**
 * 移除缓存
 * @param {String} key 缓存 key
 */
export const remove = (key) => wx.removeStorageSync(key);

/**
 * 获取缓存
 * @param {String} key 缓存 key
 */
export const get = (key) => {
  try {
    const data = wx.getStorageSync(key);
    const { __val: value, __exp: expiredAt } = data;
    if (!expiredAt) return data;
    const now = Date.now();
    // 缓存已过期
    if (now >= +expiredAt) {
      return undefined;
    }
    return value;
  } catch (err) {
    return undefined;
  }
};

/** 预设单位，缓存间隔 */
const intervals = {};
intervals.s = 1000; // 秒
intervals.m = intervals.s * 60; // 分
intervals.h = intervals.m * 60; // 时
intervals.d = intervals.h * 24; // 天

/**
 * 设置缓存
 * @param {String} key 缓存 key
 * @param {*} data 缓存内容
 * @param {Number|String} expires 过期时间（时间戳、日期时间 或 30s|10m|2h|7d 等）
 */
export const set = (key, data, expires) => {
  let expiredAt;
  if (expires) {
    if (typeof expires === 'number') {
      expiredAt = expires;
    } else if (new RegExp(
      // 匹配预设单位
      `^[0-9]+(${Object.getOwnPropertyNames(intervals).join('|')})$`,
    ).test(expires)) {
      const units = +expires.slice(0, -1);
      const interval = intervals[expires.slice(-1)] || 0;
      expiredAt = Date.now() + units * interval;
    } else {
      expiredAt = wx.$Date(expires).getTime();
    }
  }
  return wx.setStorageSync(
    key,
    expiredAt && expiredAt > 0 ? {
      __val: data,
      __exp: expiredAt,
    } : data,
  );
};

/** 清空缓存 */
export const clear = () => wx.clearStorageSync();

export default {
  get, set, remove, clear,
};
