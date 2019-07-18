import Q from '../libs/q.min';
import regeneratorRuntime from '../libs/regenerator.runtime.min';
import MinaError from './MinaError';

import $wx from './wx';
import $http from './http';

(() => {
  Object.assign(global, { Q, regeneratorRuntime, MinaError });
  wx = Object.assign({}, wx, $wx(), { $http: $http() });
})();
