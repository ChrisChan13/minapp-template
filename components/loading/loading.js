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
    label: {
      type: String,
      value: '疯狂加载中..',
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
