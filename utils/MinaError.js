class MinaError extends Error {
  constructor(payload) {
    const message = payload.errMsg || payload.error || undefined;
    super(message);
    this.hint = payload.errHint || payload.msg || undefined;
    this.code = payload.errCode || payload.code || undefined;
    this.message = message;
    this.name = 'MinaError';
  }
}

export default MinaError;
