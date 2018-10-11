Component({
  properties: {
    mask: {
      type: Boolean,
      value: false,
    },
    native: {
      type: Boolean,
      value: false,
    },
    flex: {
      type: String,
      value: 'center center',
    },
  },
  data: {
    _flex: '',
  },
  attached() {
    const flex = this.data.flex.split(' ');
    let _flex;
    if (flex[0] && (flex[0] === 'start' || flex[0] === 'end')) {
      _flex = `justify-content: flex-${flex[0]};`;
    } else {
      _flex = 'justify-content: center;';
    }
    if (flex[1] && (flex[1] === 'start' || flex[1] === 'end')) {
      _flex = `${_flex} align-items: flex-${flex[1]};`;
    } else {
      _flex = `${_flex} align-items: center;`;
    }
    this.setData({
      _flex,
    });
  },
  methods: {
    _cancelMove(e) {
      return false;
    },
    _cancelModal(e) {
      const { mask } = this.data;
      if (!mask) {
        this.triggerEvent('cancel', {});
      }
    },
  },
});
