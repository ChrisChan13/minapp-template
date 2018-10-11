Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(value) {
        this._execAnim(value);
      },
    },
    native: {
      type: Boolean,
      value: false,
    },
    mask: {
      type: Boolean,
      value: false,
    },
    itemList: Array,
    title: String,
    content: String,
    showCancel: {
      type: Boolean,
      value: true,
    },
    itemColor: {
      type: String,
      value: '#000000',
    },
    cancelText: {
      type: String,
      value: '取消',
    },
    cancelColor: {
      type: String,
      value: '#E64340',
    },
  },
  data: {
    _show: false,
    _animation: {},
  },
  created() {
    this.animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-in-out',
    });
  },
  methods: {
    _execAnim(value) {
      if (value) {
        this.animation.translateY(0).step();
        this.setData({
          _show: value,
        }, () => {
          setTimeout(() => {
            this.setData({
              _animation: this.animation.export(),
            });
          }, 100);
        });
      } else {
        this.animation.translateY(1300).step();
        this.setData({
          _animation: this.animation.export(),
        }, () => {
          setTimeout(() => {
            this.setData({
              _show: value,
            });
          }, 200);
        });
      }
    },
    _cancel() {
      this.triggerEvent('cancel', {});
    },
    _select(e) {
      this.triggerEvent('select', { index: Number(e.currentTarget.dataset.index) });
    },
  },
});
