// prefix number
const formatNumber = (n) => {
  const number = n.toString();
  return number[1] ? number : `0${number}`;
};

// format date: xxxx-xx-xx
export const formatDate = (date, join = '-') => {
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

// format date+time: xxxx-xx-xx xx:xx:xx
export const formatTimeShow = date => `${formatDate(date)} ${formatTime(date)}`;

const weeks = ['日', '一', '二', '三', '四', '五', '六'];
// format week: 星期x
export const formatWeek = day => `星期${weeks[day]}`;

// pretty time
export const prettyTime = (date, showExtras = true) => {
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  const nowDay = now.getDate();

  const pastYear = date.getFullYear();
  const pastMonth = date.getMonth() + 1;
  const pastDay = date.getDate();

  if (nowYear === pastYear
    && nowMonth === pastMonth
    && nowDay === pastDay) {
    let timeString = date.toLocaleTimeString();
    timeString = timeString.slice(0, timeString.lastIndexOf(':'));
    return `${timeString.slice(0, 2)} ${timeString.slice(2)}`;
  } if (nowYear === pastYear
    && nowMonth === pastMonth
    && nowDay - pastDay === 1) {
    let timeString = date.toLocaleTimeString();
    timeString = timeString.slice(0, timeString.lastIndexOf(':'));
    const extras = showExtras ? ` ${timeString.slice(0, 2)} ${timeString.slice(2)}` : '';
    return `昨天${extras}`;
  } if (nowYear === pastYear
    && nowMonth === pastMonth
    && nowDay - pastDay === 2) {
    let timeString = date.toLocaleTimeString();
    timeString = timeString.slice(0, timeString.lastIndexOf(':'));
    const extras = showExtras ? ` ${timeString.slice(0, 2)} ${timeString.slice(2)}` : '';
    return `${formatWeek(date.getDay())}${extras}`;
  }
  const dateString = formatDate(date, '/');
  let timeString = date.toLocaleTimeString();
  timeString = timeString.slice(0, timeString.lastIndexOf(':'));
  const extras = showExtras ? ` ${timeString.slice(0, 2)} ${timeString.slice(2)}` : '';
  return `${dateString}${extras}`;
};
