/**
 * prefix number with '0'
 * @param {Number} n number to be prefixed
 * @return {String} prefixed number string
 */
const formatNumber = n => `${n}`.padStart(2, '0');

/**
 * format date to date string with given separator
 * @param {Date} date date to be formatted
 * @param {String} [join='/'] spearator
 * @return {String} formatted date string
 */
export const formatDate = (date, join = '/') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join(join);
};

/**
 * format date to time string with given separator
 * @param {Date} date date to be formatted
 * @param {String} [join=':'] spearator
 * @return {String} formatted time string
 */
export const formatTime = (date, join = ':') => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [hour, minute, second].map(formatNumber).join(join);
};

/**
 * format date to date+time string with given separators
 * @param {Date} date date to be formatted
 * @param {[String]} separators separators
 * @param {String} [separators[0]='/']
 * @param {String} [separators[1]=':']
 * @return {String} formatted date_time string
 */
export const formatTimeShow = (date, separators) => `${formatDate(date, separators[0])} ${formatTime(date, separators[0])}`;

const WEEKS = ['日', '一', '二', '三', '四', '五', '六'];
/**
 * format date to week string
 * @param {Date} date date to be formatted
 * @return {String} formatted week string
 */
export const formatWeek = date => `周${WEEKS[date.getDay()]}`;

/**
 * format date to pretty string
 * @param {Date|String|Number} time date to be formatted
 * @param {Boolean} [detailed=true] whether format as date string or date+time string
 * @return {String} formatted pretty string
 */
export const prettyTime = (time, detailed = true) => {
  const nowTime = new Date();
  const nowYear = nowTime.getFullYear();
  const nowMonth = nowTime.getMonth() + 1;
  const nowDay = nowTime.getDate();
  const nowStamp = new Date(`${nowYear}/${nowMonth}/${nowDay} 00:00:00`).getTime();

  time = new Date(time);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const week = formatWeek(time);
  const hour = time.getHours();
  const minute = time.getMinutes();
  const stamp = new Date(`${year}/${month}/${day} 00:00:00`).getTime();

  const oneDay = 24 * 60 * 60 * 1000;

  let result = '';
  const detail = `${formatNumber(hour)}:${formatNumber(minute)}`;

  if (nowStamp === stamp) {
    result = detail;
  } else if (nowStamp - stamp === oneDay) {
    result = `昨天${detailed ? ` ${detail}` : ''}`;
  } else if (nowStamp - stamp === 2 * oneDay) {
    result = `${week}${detailed ? ` ${detail}` : ''}`;
  } else {
    result = `${year}/${formatNumber(month)}/${formatNumber(day)}${detailed ? ` ${detail}` : ''}`;
  }

  return result;
};
