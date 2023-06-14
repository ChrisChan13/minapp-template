import config from '../config';
import defer from '../libs/defer';
import promisify from '../libs/promisify';
import { DateTime } from './index';
import stores from './stores';
import cache from './cache';

(() => {
  Object.assign(wx, {
    $config: config,
    $: promisify,
    $defer: defer,
    $Date: DateTime,
    $store: stores,
    $cache: cache,
  });
})();
