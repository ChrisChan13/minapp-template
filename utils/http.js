import MinaError from './MinaError';

export default () => {
  const qiniu = {
    uptokenURL: '',
    uploadURL: '',
    domain: '',
  };

  const request = (method = 'GET') => (url, data = {}, header = {}) => new Promise((resolve, reject) => {
    // console.info(`requested(${method}) data to: ${url}`);
    // console.log(data);

    const token = wx.getStorageSync('token');
    Object.assign(header, {
      'X-Token': token,
    });

    wx.request({
      url,
      method,
      header,
      success(res) {
        // console.info(`responsed data from: ${url}`);
        // console.log(res.data);

        if (parseInt(res.statusCode, 10) === 200) resolve(res.data);
        else reject(new MinaError({ ...res.data, errApi: 'request' }));
      },
      fail(err) {
        // console.info(`responsed error from: ${url}`);
        // console.error(err);

        reject(new MinaError({ ...err, errApi: 'request' }));
      },
    });
  });

  return {
    put: request('PUT'),
    del: request('DELETE'),
    post: request('POST'),
    get: request('GET'),
    download: url => new Promise((resolve, reject) => {
      // console.info(`downloading file from: ${url}`);

      wx.downloadFile({
        url,
        success(res) {
          // console.info(`downloading result from: ${url}`);
          // console.log(res);

          if (parseInt(res.statusCode, 10) === 200) resolve(res);
          else reject(new MinaError({ ...res, errApi: 'downloadFile' }));
        },
        fail(err) {
          // console.log(`downloading error from: ${url}`);
          // console.error(err);

          reject(new MinaError({ ...err, errApi: 'downloadFile' }));
        },
      });
    }),
    upload: async local => Promise.resolve().then(() => {
      const regExp = new RegExp(`${qiniu.domain}`);
      if (regExp.test(local)) {
        // console.info('file uploaded before!');
        // console.log(local);

        const fakeError = { noRealError: true, data: local };
        return Promise.reject(fakeError);
      }
      // console.info(`uploading file to: ${qiniu.uploadURL}`);

      return request('GET')(qiniu.uptokenURL);
    }).then(responsed => new Promise(async (resolve, reject) => {
      const { token } = responsed.data;
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
          // console.info(`uploading result from: ${qiniu.uploadURL}`);
          // console.log(res.data);

          const data = JSON.parse(res.data);
          if (parseInt(res.statusCode, 10) === 200) resolve(`${qiniu.domain}${data.key}`);
          else reject(new MinaError({ ...data, errApi: 'uploadFile' }));
        },
        fail(err) {
          // console.log(`uploading error from: ${qiniu.uploadURL}`);
          // console.error(err);

          reject(new MinaError({ ...err, errApi: 'uploadFile' }));
        },
      });
    })).catch((err) => {
      if (err.noRealError) return Promise.resolve(err.data);
      return Promise.reject(err);
    }),
  };
};
