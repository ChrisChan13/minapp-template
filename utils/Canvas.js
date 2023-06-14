/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/**
 * 根据预设以及传参生成参数内容
 * @param {Object} defaults 默认参数
 * @param {Object} payload 传入参数
 * @param {PageInstance} target 页面实例
 * @returns 最终参数
 */
const destructPayload = (defaults = {}, payload = {}, target = null) => {
  // 防止覆盖
  payload.canvasId && delete payload.canvasId;
  payload.success && delete payload.success;
  payload.fail && delete payload.fail;
  const params = [Object.assign(defaults, payload)];
  target && params.push(target);
  return params;
};

// 画布生成图片
const toTempFilePath = (...params) => {
  const deferred = wx.$defer();
  const [payload = {}, ...rest] = params;
  wx.canvasToTempFilePath({
    ...payload,
    success(res) {
      deferred.resolve(res.tempFilePath);
    },
    fail(err) {
      deferred.reject(err);
    },
  }, ...rest);
  return deferred.promise;
};

// 获取画布像素数据
const getImageData = (...params) => {
  const deferred = wx.$defer();
  const [payload = {}, ...rest] = params;
  wx.canvasGetImageData({
    ...payload,
    success(res) {
      deferred.resolve(res.data);
    },
    fail(err) {
      deferred.reject(err);
    },
  }, ...rest);
  return deferred.promise;
};

// 绘制画布像素数据
const putImageData = (...params) => {
  const deferred = wx.$defer();
  const [payload = {}, ...rest] = params;
  wx.canvasPutImageData({
    ...payload,
    success(res) {
      deferred.resolve(res);
    },
    fail(err) {
      deferred.reject(err);
    },
  }, ...rest);
  return deferred.promise;
};

// 获取 canvas 对象
const getCanvas = (id, target) => {
  const deferred = wx.$defer();
  const query = wx.createSelectorQuery();
  target && query.in(target);
  query.select(`#${id}`).fields({
    size: true, context: true,
  }, (res) => {
    if (res.context) deferred.resolve(res);
    else deferred.reject(new Error(`Canvas#${id} is not found!`));
  }).exec();
  return deferred.promise;
};

/**
 * 画布类
 *
 * 请保持 canvas-id 与 element-id 一致，方便获取上下文信息
 *
 * 支持原型上直接调用：
 * ```
 * Canvas.fillStyle = 'red';
 * Canvas.fillRect(10, 10, 150, 75);
 * await Canvas.draw();
 * ```
 * 也支持链式调用：
 * ```
 * await Canvas.exec('fillStyle', 'red')
 *   .exec('fillRect', 10, 10, 150, 75)
 *   .draw();
 * ```
 */
export default class Canvas {
  constructor(id, target) {
    this.id = id; // canvasId 与 elementId 相同
    this.target = target; // 页面实例
    this.width = 0; // 画布大小
    this.height = 0; // 画布大小
    this.context = null; // 画布上下文
  }

  /** 初始化画布 */
  async init() {
    const canvas = await getCanvas(this.id, this.target);
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.context;
    // 将 canvas.context 中的 属性/函数 挂载到 this 上，方便 获取/运行
    Object.getOwnPropertyNames(Object.getPrototypeOf(canvas.context)).map((key) => {
      if (key in this) return key;
      Object.defineProperty(this, key, {
        get: () => this.state[key],
      });
      return key;
    });
  }

  toTempFilePath(payload) {
    if (!this.context) throw new Error('Please invoke Canvas.init first!');
    return toTempFilePath(...destructPayload({
      fileType: 'jpg',
      quality: 1,
      canvasId: this.id,
    }, payload, this.target));
  }

  getImageData(payload) {
    if (!this.context) throw new Error('Please invoke Canvas.init first!');
    return getImageData(...destructPayload({
      canvasId: this.id,
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    }, payload, this.target));
  }

  putImageData(payload) {
    if (!this.context) throw new Error('Please invoke Canvas.init first!');
    return putImageData(...destructPayload({
      canvasId: this.id,
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    }, payload, this.target));
  }

  /**
   * 执行对应 Canvas.context 的链式操作
   * @param {String} proto Canvas.context 的 属性/函数 名
   * @param  {...*} payload Canvas.context 的 属性值/函数参数
   * @returns {Canvas|*} 返回原型或函数返回值
   * ---
   * **示例代码**
   * ```
   * canvas.exec('moveTo', 10, 10)
   *   .exec('lineTo', 100, 10)
   *   .exec('lineTo', 100, 100)
   *   .exec('closePath')
   *   .exec('stroke');
   * await canvas.draw();
   * ```
   * 或：
   * ```
   * canvas.exec('font', 'italic bold 20px sans-serif');
   * const metrics = canvas.exec('measureText', 'Hello World');
   * ```
   */
  exec(proto, ...payload) {
    if (!this.context) throw new Error('Please invoke Canvas.init first!');
    if (typeof this.context[proto] === 'function') {
      const result = this.context[proto](...payload);
      if (typeof result !== 'undefined') return result;
    } else {
      [this.context[proto]] = payload;
    }
    return this;
  }

  draw(reserve = true) {
    if (!this.context) throw new Error('Please invoke Canvas.init first!');
    const deferred = wx.$defer();
    this.context.draw(reserve, () => {
      deferred.resolve();
    });
    return deferred.promise;
  }
}
