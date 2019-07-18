export default () => {
  const { Q, regeneratorRuntime, MinaError } = global;

  const qiniu = {
    uptokenURL: '',
    uploadURL: '',
    domain: '',
  };

  const request = (method = 'GET') => async (url, data = {}, header = {}) => {
    const deferred = Q.defer();
    console.info(`requested(${method}) data to: ${url}`);
    console.log(data);

    const token = (await wx.getStorage({ key: 'token' })) || '';
    Object.assign(header, {
      'X-Token': token,
    });

    wx.request({
      url,
      method,
      header,
      success(res) {
        console.info(`responsed data from: ${url}`);
        console.log(res.data);

        if (parseInt(res.statusCode, 10) === 200) deferred.resolve(res.data);
        else deferred.reject(res.data);
      },
      fail(err) {
        console.info(`responsed error from: ${url}`);
        console.error(err);

        deferred.reject(new MinaError(err));
      },
    });
    return deferred.promise;
  };

  return {
    put: request('PUT'),
    del: request('DELETE'),
    post: request('POST'),
    get: request('GET'),
    download: (url) => {
      const deferred = Q.defer();
      console.info(`downloading file from: ${url}`);

      wx.downloadFile({
        url,
        success(res) {
          console.info(`downloading result from: ${url}`);
          console.log(res);

          if (parseInt(res.statusCode, 10) === 200) deferred.resolve(res);
          else deferred.reject(res);
        },
        fail(err) {
          console.log(`downloading error from: ${url}`);
          console.error(err);

          deferred.reject(new MinaError(err));
        },
      });
      return deferred.promise;
    },
    upload: async (local) => {
      const deferred = Q.defer();
      const regExp = new RegExp(`${qiniu.domain}`);
      if (regExp.test(local)) {
        console.info('file uploaded before!');
        console.log(local);

        deferred.resolve(local);
      } else {
        console.info(`uploading file to: ${qiniu.uploadURL}`);

        const { token } = (await request('GET')(qiniu.uptokenURL)).data;
        const now = Date.now();
        const random = `${Math.round(Math.random() * 9999999)}`;
        const key = `${now}${random.padStart(7, '0')}`;

        wx.uploadFile({
          url: qiniu.uploadURL,
          filePath: local,
          name: 'file',
          formData: {
            key,
            token,
          },
          success(res) {
            console.info(`uploading result from: ${qiniu.uploadURL}`);
            console.log(res.data);

            const data = JSON.parse(res.data);
            if (parseInt(res.statusCode, 10) === 200) deferred.resolve(`${qiniu.domain}${data.key}`);
            else deferred.reject(new MinaError(data));
          },
          fail(err) {
            console.log(`uploading error from: ${qiniu.uploadURL}`);
            console.error(err);

            deferred.reject(new MinaError(err));
          },
        });
      }
      return deferred.promise;
    },
  };
};
