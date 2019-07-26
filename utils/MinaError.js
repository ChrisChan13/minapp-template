const errHints = new Map([
  ['login', '微信登录失败'],
  ['getLocation', '获取地理位置信息失败'],
  ['chooseImage', '取消图片选择'],
  ['chooseLocation', '取消位置选择'],
  ['authorize', '获取授权信息失败'],
  ['getImageInfo', '获取图片信息失败'],
  ['saveImageToPhotosAlbum', '保存图片失败'],
  ['getUserInfo', '获取用户信息失败'],
  ['requestPayment', '取消支付'],
  ['saveVideoToPhotosAlbum', '保存视频失败'],
  ['chooseVideo', '取消视频选择'],
  ['saveFile', '保存文件失败'],
  ['getFileInfo', '获取文件信息失败'],
  ['request', '请求失败 >_<'],
  ['downloadFile', '下载失败 >_<'],
  ['uploadFile', '上传失败 >_<'],
  ['compressImage', '图片压缩失败'],
  ['chooseAddress', '取消地址选择'],
  ['getWeRunData', '获取微信运动步数失败'],
  ['setClipboardData', '复制失败'],
  ['scanCode', '未发现可用二维码'],
]);

class MinaError extends Error {
  constructor(payload) {
    const message = payload.error || payload.errMsg || undefined;
    super(message);
    this.hint = payload.msg || payload.errHint || errHints.get(payload.errApi) || undefined;
    this.code = payload.code || payload.errCode || undefined;
    this.message = message;
    this.name = 'MinaError';
  }
}

export default MinaError;
