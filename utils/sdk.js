(() => {
  const modifyProperty = (payload, property, hook) => {
    if (payload[property]) {
      const origin = payload[property];
      if (typeof origin === 'function') {
        payload[property] = function reasignFunction(params) {
          hook.call(this, params, property);
          origin.call(this, params);
        };
      } else {
        Object.assign(payload[property], hook);
      }
    } else if (typeof payload[property] === 'function') {
      payload[property] = function reasignFunction(params) {
        hook.call(this, params, property);
      };
    } else {
      payload[property] = hook;
    }
  };
  return (() => {
    const wxApp = App;
    const wxPage = Page;

    App = (payload) => {
      wxApp(payload);
    };

    Page = (payload) => {
      wxPage(payload);
    };
  })();
})();
