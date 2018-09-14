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
  },
  data: {},
  methods: {
    _cancelMove(e) {
      return false;
    },
    _cancelModal(e) {
      const { mask } = this.data;
      if (!mask) {
        this.triggerEvent('cancel');
      }
    },
  },
});
