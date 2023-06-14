import './utils/mixins';

App({
  globalData: {
    systemInfo: {},
  },
  onLaunch(options) {
    this.getSystemInfo();
  },
  onShow(options) {
    this.checkScene(options);
    this.checkForUpdate();
  },
  /**
   * 关闭上层页面，重定向至新页面
   * @param {String} url 页面路径
   * @param {Number} delta 页面数
   */
  redirectTo(url, delta) {
    if (delta > 0) {
      wx.navigateBack({ delta });
    }
    wx.redirectTo({ url });
  },
  /**
   * 获取上层页面实例
   * @param {Number} delta 页面数
   * @returns 页面实例
   */
  getPrevPage(delta = 1) {
    const pages = getCurrentPages();
    return pages[pages.length - delta - 1];
  },
  /**
   * 展示 Loading
   * @param {String} title loading 标题
   */
  showLoading(title) {
    return wx.showLoading({
      title,
      mask: true,
    });
  },
  /**
   * 报错信息展示
   * @param {String} title 默认错误信息
   * @param {Any} error 错误对象
   */
  showToast(title, error) {
    let message = '';
    if (error instanceof Error) console.error(error);
    else if (error) message = error.msg;
    this.sendError(title, error);
    return wx.showToast({
      icon: 'none',
      title: message || title || '请求失败，请重试',
    });
  },
  /**
   * 报错信息展示
   * @param {String} content 默认错误信息
   * @param {Any} error 错误对象
   * @param {String} title 默认错误标题
   */
  showModal(content, error, title = '提示') {
    let message = '';
    if (error instanceof Error) console.error(error);
    else if (error) message = error.msg;
    this.sendError(content, error);
    return wx.showModal({
      title,
      content: message || content || '请求失败，请重试',
      showCancel: false,
    });
  },
  /**
   * 记录错误日志
   * @param {Any} error 错误对象
   */
  sendError(message, error) {
    if (
      wx.$config.ENV !== 'prod' || !error || !wx.canIUse('getRealtimeLogManager')
    ) return;
    if (!this.logger) {
      this.logger = wx.getRealtimeLogManager();
    }
    if ('errCode' in error || 'errMsg' in error) { // WX API 报错
      this.logger.info({
        message,
        error,
      });
    } else if ('code' in error || 'msg' in error) { // 接口报错
      this.logger.warn({
        message,
        error,
      });
    } else { // 代码逻辑报错
      this.logger.error({
        message,
        error,
      });
    }
  },
  /** 获取系统信息 */
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    Object.assign(systemInfo, {
      // 设备像素比
      ratio: +Number(systemInfo.windowWidth / 750).toFixed(3),
    });
    this.globalData.systemInfo = systemInfo;
  },
  /** 检测场景值 */
  checkScene(options) {
    switch (options.scene) {
      case 1154: // 朋友圈内打开“单页模式”
      case 1155: // “单页模式”打开小程序
        break;
      case 1008: // 群聊会话中的小程序消息卡片
      case 1044: // 带 shareTicket 的小程序消息卡片
      case 1158: // 群工具打开小程序
      case 1159: // 群工具打开小程序
      case 1160: // 群待办
      case 1185: // 群公告
        break;
      default:
    }
  },
  /** 检查小程序更新 */
  checkForUpdate() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      if (!res.hasUpdate) return;
      const onUpdateReady = async () => {
        const { confirm } = await wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
        });
        if (confirm) updateManager.applyUpdate();
      };
      updateManager.onUpdateReady(onUpdateReady);
    });
  },
  /**
   * 根据登录态自动重试请求
   * @param {Function} request API 请求
   * @param {Object} data API 请求数据
   * @param {Number} retries 重试次数, retries 为 -1 时只做重新登录, 不做请求重试。
   * 如：encryptedData、iv 等敏感信息，与微信登录态有关，重新登录时失效，需重新生成。
   */
  async request(request, data, retries = 0) {
    // 超出 3 次重试机会
    if (retries >= 3) return request(data);
    let result = {};
    try {
      result = await request(data);
    } catch (err) {
      result = err;
    } finally {
      /* eslint-disable no-unsafe-finally */
      // token 验证失败, 登录重试
      if (result.code === 401) {
        try {
          await this.userLogin();
          if (retries === -1) return Promise.reject(result);
          // 递归重试, 次数 +1
          return this.request(request, data, retries + 1);
        } catch (err) {
          return Promise.reject(result);
        }
      }
      // 请求成功
      if (result.code === 0) return Promise.resolve(result);
      return Promise.reject(result);
    }
  },
  /** 用户登录 */
  userLogin() {},
});
