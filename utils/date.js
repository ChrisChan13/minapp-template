// prefix number
const formatNumber = n => `${n}`.padStart(2, '0');

// format date: xxxx/xx/xx
export const formatDate = (date, join = '/') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join(join);
};

// format time: xx:xx:xx
export const formatTime = (date, join = ':') => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [hour, minute, second].map(formatNumber).join(join);
};

// format date+time: xxxx/xx/xx xx:xx:xx
export const formatTimeShow = date => `${formatDate(date)} ${formatTime(date)}`;

const weeks = ['日', '一', '二', '三', '四', '五', '六'];
// format week: 星期x
export const formatWeek = date => `星期${weeks[date.getDay()]}`;

// pretty time
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
    // xx:xx
    result = detail;
  } else if (nowStamp - stamp === oneDay) {
    // 昨天 xx:xx
    result = `昨天${detailed ? ` ${detail}` : ''}`;
  } else if (nowStamp - stamp === 2 * oneDay) {
    // 星期x xx:xx
    result = `${week}${detailed ? ` ${detail}` : ''}`;
  } else {
    // xxxx/xx/xx xx:xx
    result = `${year}/${formatNumber(month)}/${formatNumber(day)}${detailed ? ` ${detail}` : ''}`;
  }

  return result;
};
