/**
 * 版本号对比
 * @param {String} version 对比的版本号
 * @param {String} comparedVersion 被对比的版本号
 * @returns {-1|0|1} 对比结果
 *
 * **对比结果：**
 * - -1： version 小于 comparedVersion
 * - 0： version 等于 comparedVersion
 * - 1： version 大于 comparedVersion
 */
export const compareVersion = (version, comparedVersion) => {
  const versionSeries = version.split('.');
  const comparedVersionSeries = comparedVersion.split('.');
  const versionDigits = Math.max(versionSeries.length, comparedVersionSeries.length);
  // 版本号长度对齐
  while (versionSeries.length < versionDigits) versionSeries.push('0');
  while (comparedVersionSeries.length < versionDigits) comparedVersionSeries.push('0');
  for (let i = 0; i < versionDigits; i++) {
    const number = parseInt(versionSeries[i], 10);
    const comparedNumber = parseInt(comparedVersionSeries[i], 10);
    if (number > comparedNumber) return 1;
    if (number < comparedNumber) return -1;
  }
  return 0;
};

/**
 * DateTime 类型
 * @param {Date|String|Number} date 时间日期
 * @returns {Date} 转换后的时间日期
 */
export const DateTime = (date) => {
  if (typeof date === 'undefined') return new Date();
  if (date instanceof Date) return date;
  if (typeof date === 'string') return new Date(date.replace(/-/g, '/'));
  return new Date(date);
};

/**
 * 将时间转换为东八区
 * @param {Date} date 时间日期
 * @returns {Data} 东八区时间日期
 */
export const toEast8Time = (date) => {
  const timezoneOffset = new Date().getTimezoneOffset();
  if (timezoneOffset === -480) return date;
  return new Date(
    date.getTime() + timezoneOffset * 60 * 1000 - (-8 * 60 * 60 * 1000),
  );
};

/**
 * 数字前位补零
 * @param {String|Number} n 原数字
 * @returns {String} 补零后的数字
 */
export const formatNumber = (n) => (`${n}`[1] ? `${n}` : `0${n}`);

/**
 * 格式化日期: xxxx/xx/xx
 * @param {Date} date 时间日期
 * @param {String} join 连接符，默认 '-'
 * @returns {String} 格式化后的日期
 */
export const formatDate = (date, join = '-') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join(join);
};

/**
 * 格式化时间： xx:xx:xx
 * @param {Date} date 时间日期
 * @param {String} join 连接符，默认 ':'
 * @returns {String} 格式化后的时间
 */
export const formatTime = (date, join = ':') => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [hour, minute, second].map(formatNumber).join(join);
};

/**
 * 格式化日期和时间： xxxx/xx/xx xx:xx:xx
 * @param {Date} date 时间日期
 * @param {String[]} joins 日期和时间的连接符，默认 ['-', ':']
 * @returns {String} 格式化后的日期和时间
 */
export const formatDateTime = (
  date,
  joins = ['-', ':'],
) => `${formatDate(date, joins[0])} ${formatTime(date, joins[1])}`;
