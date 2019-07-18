export default (() => {
  const { Q, regeneratorRuntime, MinaError } = global;

  const destructPayload = (defaults = {}, payload = {}, next, instance) => {
    const params = Object.assign(defaults, (() => {
      const temp = Object.assign({}, payload);
      delete temp.canvasId;
      return temp;
    })());
    return next(params, instance);
  };

  const getInfo = (canvasId, instance) => {
    const deferred = Q.defer();
    const query = wx.createSelectorQuery();
    query.in(instance);
    query.selectAll(`#${canvasId}`).boundingClientRect()
      .exec((res) => {
        if (res[0].length === 1) {
          deferred.resolve(res[0][0]);
        } else {
          deferred.reject(new MinaError({ errHint: '找不到对应画布' }));
        }
      });
    return deferred.promise;
  };

  const getImageData = (params, instance) => {
    const deferred = Q.defer();
    wx.canvasGetImageData({
      ...params,
      success(res) {
        deferred.resolve(res);
      },
      fail(err) {
        deferred.reject(new MinaError({ ...err, errHint: '所选画布区域为空' }));
      },
    }, instance);
    return deferred.promise;
  };

  const getThemeColor = async (params, instance) => {
    const deferred = Q.defer();
    const block = 5;
    const rgb = { r: 0, g: 0, b: 0 };
    let count = 0;
    const { data } = await getImageData(params, instance);
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

  const putImageData = (params, instance) => {
    const deferred = Q.defer();
    wx.canvasPutImageData({
      ...params,
      success(res) {
        deferred.resolve();
      },
      fail(err) {
        deferred.reject(new MinaError({ ...err, errHint: '图像数据错误' }));
      },
    }, instance);
    return deferred.promise;
  };

  const toTempFilePath = (params, instance) => {
    const deferred = Q.defer();
    wx.canvasToTempFilePath({
      ...params,
      success(res) {
        deferred.resolve(res.tempFilePath);
      },
      fail(err) {
        deferred.reject(new MinaError({ ...err, errHint: '生成图片失败' }));
      },
    }, instance);
    return deferred.promise;
  };

  class Canvas {
    constructor(canvasId, instance) {
      this.id = canvasId;
      this.instance = instance;
    }

    async init() {
      Object.assign(this, {
        ...await getInfo(this.id, this.instance),
        context: wx.createCanvasContext(this.id, this.instance),
      });
      return this;
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
        const deferred = Q.defer();
        const params = [
          typeof payload[0] === 'boolean' ? payload[0] : true,
          (() => {
            if (typeof payload[1] === 'function') payload[1]();
            deferred.resolve(this);
          })(),
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

  return Canvas;
})();
