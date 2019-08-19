(() => {
  const modifyProperty = (payload, property, hook) => {
    if (property in payload) {
      const origin = payload[property];
      if (typeof origin === 'function') {
        payload[property] = function reassignFunction(params) {
          hook.call(this, params, property);
          origin.call(this, params);
        };
      } else {
        Object.assign(payload[property], hook);
      }
    } else {
      payload[property] = hook;
    }
  };
  return (() => {
    const wxApp = App;
    const wxPage = Page;

    App = (payload) => {
      modifyProperty(payload, 'onLaunch', () => {
        const updateManager = wx.getUpdateManager();
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            },
          });
        });
      });

      wxApp(payload);
    };

    Page = (payload) => {
      wxPage(payload);
    };
  })();
})();
