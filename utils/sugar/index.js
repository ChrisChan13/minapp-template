import * as $ from './wx';
import * as $http from './http';
import * as $route from './route';
import * as $cache from './cache';
import * as $router from './router';

export default (target) => {
  console.time();
  Object.defineProperties(target, {
    $: {
      value: { ...$ },
    },
    $http: {
      value: { ...$http },
    },
    $route: {
      value: { ...$route },
    },
    $router: {
      value: { ...$router },
    },
    $cache: {
      value: { ...$cache },
    },
  });
  console.timeEnd();
};
