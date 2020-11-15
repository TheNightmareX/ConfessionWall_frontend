import axios from "axios";

/**
 *
 * @param {any} obj
 * @param {'snake' | 'camel'} to
 */
export function convertCase(obj, to) {
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
        ? convertCase(value, to)
        : value;
  }
  return newObj;
}

axios.defaults.baseURL = "/api/";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

/**@typedef {import("./confessions").Confession} Confession
 * @typedef {import("./comments").Comment} Comment
 * @typedef {import("./people").Person} Person */

export * as auth from "./auth";
export * as comments from "./comments";
export * as confessions from "./confessions";
export * as likes from "./likes";
export * as people from "./people";
