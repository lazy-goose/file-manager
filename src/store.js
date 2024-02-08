/**
 * @typedef {{
 *  username: string
 * }} Store
 */

/**
 * @type {Store}
 */
let store = {
  username: '',
};

const get = () => store;

/**
 * @param {Store} newStore
 */
const set = (newStore) => (store = newStore);

/**
 * @template {keyof Store} T
 * @param {T} key
 */
const getValue = (key) => store[key];

/**
 * @template {keyof Store} T
 * @param {T} key
 * @param {Store[T]} value
 */
const setValue = (key, value) => (store[key] = value);

export default { get, set, getValue, setValue };
