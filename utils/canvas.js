import Q from '../libs/q.min';
import regeneratorRuntime from '../libs/regenerator.runtime.min';

// destruct params
const destructPayload = (defaults = {}, payload = {}, next) => {
  const params = Object.assign(defaults, (() => {
    const temp = Object.assign({}, payload);
    delete temp.canvasId;
    delete temp.success;
    delete temp.fail;
    delete temp.complete;
    return temp;
  })());
  return next(params);
};

const getInfo = (canvasId, instance) => {
  const deferred = Q.defer();
  const query = wx.createSelectorQuery();
  if (typeof instance !== 'undefined') query.in(instance);
  query.selectAll(`#${canvasId}`).boundingClientRect()
    .exec((res) => {
      if (res[0].length) {
        deferred.resolve(res[0][0]);
      } else {
        deferred.reject(new Error('找不到对应画布'));
      }
    });
  return deferred.promise;
};

const createContext = (canvasId, instance) => {
  const deferred = Q.defer();
  const params = [canvasId];
  if (typeof instance !== 'undefined') params.push(instance);
  const context = wx.createCanvasContext(...params);
  deferred.resolve(context);
  return deferred.promise;
};

const getImageData = (params) => {
  const deferred = Q.defer();
  wx.canvasGetImageData({
    ...params,
    success(res) {
      deferred.resolve(res);
    },
    fail(err) {
      deferred.reject(new Error('所选画布区域为空'));
    },
  });
  return deferred.promise;
};

const getThemeColor = async (params) => {
  const deferred = Q.defer();
  const block = 5;
  const rgb = { r: 0, g: 0, b: 0 };
  let count = 0;
  const { data } = await getImageData(params);
  const { length } = data;
  let i = block * 4 - 4;
  while (i < length) {
    ++count;
    rgb.r += data[i];
    rgb.g += data[i + 1];
    rgb.b += data[i + 2];
    i += block * 4;
  }
  /* eslint-disable no-bitwise */
  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);
  deferred.resolve(rgb);
  return deferred.promise;
};

const putImageData = (params) => {
  const deferred = Q.defer();
  wx.canvasPutImageData({
    ...params,
    success(res) {
      deferred.resolve();
    },
    fail(err) {
      deferred.reject(new Error('图像数据错误'));
    },
  });
  return deferred.promise;
};

const toTempFilePath = (params) => {
  const deferred = Q.defer();
  wx.canvasToTempFilePath({
    ...params,
    success(res) {
      deferred.resolve(res.tempFilePath);
    },
    fail(err) {
      deferred.reject(new Error('生成图片失败'));
    },
  });
  return deferred.promise;
};

class Canvas {
  async init(instance) {
    Object.assign(this, {
      ...await getInfo(this.id, instance),
      context: await createContext(this.id, instance),
    });
    return this;
  }

  constructor(canvasId) {
    this.id = canvasId;
  }

  getImageData(payload) {
    return destructPayload({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      canvasId: this.id,
    }, payload, getImageData);
  }

  putImageData(payload) {
    return destructPayload({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      canvasId: this.id,
    }, payload, putImageData);
  }

  getThemeColor(payload) {
    return destructPayload({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      canvasId: this.id,
    }, payload, getThemeColor);
  }

  toTempFilePath(payload) {
    return destructPayload({
      fileType: 'jpg',
      quality: 1,
      canvasId: this.id,
    }, payload, toTempFilePath);
  }

  exec(proto, ...payload) {
    if (typeof this.context === 'undefined') throw new Error('请先初始化画布');
    let result;
    if (proto === 'draw') {
      const deferred = Q.defer();
      const params = [
        typeof payload[0] === 'boolean' ? payload[0] : true,
        () => {
          if (typeof payload[1] === 'function') payload[1]();
          deferred.resolve(this);
        },
      ];
      this.context.draw(...params);
      result = deferred.promise;
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

export default Canvas;
