// navigate page
export const push = (url) => {
  wx.navigateTo({ url });
};

// navigate back
export const go = (delta) => {
  wx.navigateBack({ delta: Math.abs(delta) });
};

// replace page(s)
export const replace = (url, type = 'current') => {
  if (type === 'current') {
    wx.redirectTo({ url });
  } else if (type === 'all') {
    wx.reLaunch({ url });
  } else if (type === 'tab') {
    wx.switchTab({ url });
  } else {
    wx.redirectTo({ url });
  }
};
