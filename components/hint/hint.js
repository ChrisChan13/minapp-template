Component({
  properties: {
    width: {
      type: String,
      value: '100%',
    },
    height: {
      type: String,
      value: '100%',
    },
  },
  data: {
    _style: '',
  },
  attached() {
    this.setData({
      _style: `width: ${this.data.width}; height: ${this.data.height};`,
    });
  },
  methods: {},
});
