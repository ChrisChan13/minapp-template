/* eslint-disable no-underscore-dangle */
/** 简易 store 实现 */
const store = {};

/**
 * 在当前 page 中注入 store 状态
 * @param {String[]} states 需要注入的状态
 *
 * **示例代码**
 * ```javascript
 * Page({
 *   // 在普通页面 onLoad 时注入
 *   onLoad(query) {
 *     wx.$store.mapState(['yourState', 'otherState']);
 *   },
 *   // 在 Tab 页面 onShow 时注入
 *   onShow() {
 *     wx.$store.mapState(['yourState', 'otherState']);
 *   },
 * });
 * ```
 */
export const mapState = (states = []) => {
  const mapped = [];
  const mappedState = {};
  states.map((item) => {
    if (typeof item === 'string' && item in store.state) {
      mapped.push(item);
      Object.assign(mappedState, {
        [item]: store.state[item],
      });
    }
    return item;
  });
  // 目前只支持 Page Data，依附于 getCurrentPages 获取页面对象
  // 注意：Tab 页面之间切换时，getCurrentPages 获取不到 Tab 页面栈
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  page.__mappedState__ = mapped;
  page.setData(mappedState);
  return mappedState;
};

/**
 * 提交 mutation 与 载荷
 * @param {String} mutation 待提交 mutation
 * @param {*} payload 载荷
 *
 * **示例代码**
 * ```javascript
 * Page({
 *   updateUserInfo() {
 *     wx.$store.commit('yourMutation', yourPayloadData);
 *   },
 * });
 * ```
 */
export const commit = (mutation, payload) => {
  if (!(mutation in store.mutation)) return;
  store.mutation[mutation](payload);
};

/**
 * 设置/更新 store.state 对象
 * @param {Object} states 待 设置/更新 states
 *
 * **示例代码**
 * ```javascript
 * Page({
 *   updateUserInfo() {
 *     wx.$store.setState({ userInfo });
 *   },
 * });
 * ```
 */
export const setState = (states = {}) => {
  const mappedStates = {};
  // 只更新 createStore 时配置的 state 数据内容，防止数据结构混乱
  Object.getOwnPropertyNames(states).filter((key) => key in store.state).map((key) => {
    Object.assign(mappedStates, { [key]: states[key] });
    return key;
  });
  Object.assign(store.state, mappedStates);
  const mappedStateNames = Object.getOwnPropertyNames(mappedStates);
  const pages = getCurrentPages();
  // 遍历页面栈更新数据
  pages.map((page) => {
    if (page.__mappedState__) {
      const payload = {};
      mappedStateNames.map((item) => {
        if (page.__mappedState__.indexOf(item) > -1) {
          Object.assign(payload, {
            [item]: states[item],
          });
        }
        return item;
      });
      // 更新的数据若未在该页面中注入，则无需更新页面
      if (Object.getOwnPropertyNames(payload).length > 0) {
        page.setData(payload);
      }
    }
    return page;
  });
};

/**
 * 创建 store 对象
 * @param {{ state: {}, mutation: {} }} props 状态信息
 * @returns store
 */
export const createStore = (props = {}) => {
  Object.assign(store, {
    state: props.state || {},
    mutation: props.mutation || {},
    setState,
    mapState,
    commit,
  });
  // 将 store.state 中的内容挂载到 store 上，方便获取
  // 如：store[yourStateName]
  Object.getOwnPropertyNames(props.state).map((key) => {
    if (key in store) return key;
    Object.defineProperty(store, key, {
      get: () => store.state[key],
    });
    return key;
  });
  return store;
};

export default createStore;
