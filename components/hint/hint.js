Component({
  properties: {
    width: {
      type: String,
      value: '100%',
      observer() {
        this._setStyle();
      },
    },
    height: {
      type: String,
      value: '100%',
      observer() {
        this._setStyle();
      },
    },
  },
  data: {
    _style: '',
  },
  methods: {
    _setStyle() {
      this.setData({
        _style: `width: ${this.data.width}; height: ${this.data.height};`,
      });
    },
  },
});
