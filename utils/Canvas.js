import MinaError from './MinaError';

const destructPayload = (defaults = {}, payload = {}, func, instance) => {
  delete payload.canvasId;
  delete payload.success;
  delete payload.fail;
  const params = Object.assign(defaults, payload);
  return func(params, instance);
};

const getInfo = (canvasId, instance) => new Promise((resolve, reject) => {
  const query = wx.createSelectorQuery();
  query.in(instance);
  query.selectAll(`#${canvasId}`).boundingClientRect()
    .exec((res) => {
      if (res[0].length === 1) {
        resolve(res[0][0]);
      } else {
        reject(new MinaError({ errMsg: 'Canvas not found' }));
      }
    });
});

const getImageData = (params, instance) => new Promise((resolve, reject) => {
  wx.canvasGetImageData({
    ...params,
    success(res) {
      resolve(res);
    },
    fail(err) {
      reject(new MinaError({ ...err, errHint: '图像数据错误' }));
    },
  }, instance);
});

const getThemeColor = (params, instance) => getImageData(params, instance).then((res) => {
  const { data } = res;
  const block = 5;
  const rgb = { r: 0, g: 0, b: 0 };
  let count = 0;
  const { length } = data;
  let i = block * 4 - 4;
  while (i < length) {
    ++count;
    rgb.r += data[i];
    rgb.g += data[i + 1];
    rgb.b += data[i + 2];
    i += block * 4;
  }
  // eslint-disable-next-line
  rgb.r = ~~(rgb.r / count);
  // eslint-disable-next-line
  rgb.g = ~~(rgb.g / count);
  // eslint-disable-next-line
  rgb.b = ~~(rgb.b / count);
  return rgb;
});

const putImageData = (params, instance) => new Promise((resolve, reject) => {
  wx.canvasPutImageData({
    ...params,
    success(res) {
      resolve();
    },
    fail(err) {
      reject(new MinaError({ ...err, errHint: '图像数据错误' }));
    },
  }, instance);
});

const toTempFilePath = (params, instance) => new Promise((resolve, reject) => {
  wx.canvasToTempFilePath({
    ...params,
    success(res) {
      resolve(res.tempFilePath);
    },
    fail(err) {
      reject(new MinaError({ ...err, errHint: '生成图片失败' }));
    },
  }, instance);
});

export default class Canvas {
  constructor(canvasId, instance) {
    this.id = canvasId;
    this.instance = instance;
  }

  init() {
    return getInfo(this.id, this.instance).then((info) => {
      Object.assign(this, {
        ...info,
        context: wx.createCanvasContext(this.id, this.instance),
      });
      return this;
    });
  }

  getImageData(payload) {
    return destructPayload({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      canvasId: this.id,
    }, payload, getImageData, this.instance);
  }

  putImageData(payload) {
    return destructPayload({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      canvasId: this.id,
    }, payload, putImageData, this.instance);
  }

  getThemeColor(payload) {
    return destructPayload({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      canvasId: this.id,
    }, payload, getThemeColor, this.instance);
  }

  toTempFilePath(payload) {
    return destructPayload({
      fileType: 'jpg',
      quality: 1,
      canvasId: this.id,
    }, payload, toTempFilePath, this.instance);
  }

  exec(proto, ...payload) {
    if (typeof this.context === 'undefined') throw new MinaError({ errMsg: '请先初始化画布' });
    let result;
    if (proto === 'draw') {
      result = new Promise((resolve, reject) => {
        this.context.draw(
          typeof payload[0] === 'boolean' ? payload[0] : true,
          (() => {
            if (typeof payload[1] === 'function') payload[1]();
            resolve(this);
          })(),
        );
      });
    } else if (typeof this.context[proto] === 'function') {
      this.context[proto](...payload);
      result = this;
    } else {
      [this.context[proto]] = payload;
      result = this;
    }
    return result;
  }
}
