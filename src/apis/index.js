import axios from "axios";

axios.defaults.baseURL = "/api/";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

/**@typedef {import("./comments").Comment} Comment */
/**@typedef {import("./confessions").Confession} Confession */
/**@typedef {import("./people").Person} Person */

export { default as auth } from "./auth";
export { default as comments } from "./comments";
export { default as confessions } from "./confessions";
export { default as likes } from "./likes";
export { default as people } from "./people";

/**
 *
 * @param {any} obj
 * @param {'snake' | 'camel'} to
 */
function convertFieldCase(obj, to) {
  if (typeof obj != "object") return obj;
  const newObj = {};
  const re = { camel: /_(\w)/g, snake: /([a-z])([A-Z])/g }[to];
  const replacer = {
    camel: (all, letter) => letter.toUpperCase(),
    snake: (all, front, letter) => `${front}_${letter.toLowerCase()}`,
  }[to];
  for (const key in obj) {
    const value = obj[key];
    const newKey = re.test(key) ? key.replace(re, replacer) : key;
    newObj[newKey] =
      typeof value == "object" && value != null
        ? convertFieldCase(value, to)
        : value;
  }
  return newObj;
}

/**
 * A decorator which makes a ordinary method an async method,
 * provides auto case conversions and extract `data` field from
 * an `AxiosResponse` the method returns.
 * @param {Object} target
 * @param {string} name
 * @param {PropertyDescriptor} descriptor
 */
export function api(target, name, descriptor) {
  /**@type {(...) => Promise<import("axios").AxiosResponse>} */
  const fn = target[name];
  descriptor.value = async function(...camelArgs) {
    const snakeArgs = [];
    for (const arg of camelArgs) {
      snakeArgs.push(convertFieldCase(arg, "snake"));
    }
    const snakeReturns = (await fn(...snakeArgs)).data;
    const camelReturns = convertFieldCase(snakeReturns, "camel");
    return camelReturns;
  };
  return descriptor;
}
