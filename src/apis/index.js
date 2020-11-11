import axios from "axios";

function toCamelCase(obj) {
  const newObj = {};
  const re = /_(\w)/g;
  for (const key in obj) {
    const value = obj[key];
    const newKey = re.test(key)
      ? key.replace(re, (all, letter) => letter.toUpperCase())
      : key;
    newObj[newKey] = typeof value == "object" ? toCamelCase(value) : value;
  }
  return newObj;
}

const instance = axios.create({
  baseURL: "/api/",
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

/**
 *
 * @typedef {Object} Confession
 * @property {number} id
 * @property {{ nickname: string, sex: 'm' | 'f' }} sender
 * @property {Confession['sender']} receiver
 * @property {string} text
 * @property {number} likes
 * @property {number} comments
 * @property {string} creationTime
 */
/**
 *
 * @param {number} id
 * @returns {Confession}
 */
export async function getConfession(id) {
  return toCamelCase((await instance.get(`confessions/${id}`)).data);
}
/**
 *
 * @param {'latest' | 'earlest' | 'hottest' | 'coldest'}
 * @returns {Promise<{ data: Object<number, Confession> , totalPages: number }>}
 */
export async function getConfessions(page = 1, sort = "latest") {
  return toCamelCase(
    (await instance.get(`confessions/pages/${page}`, { params: { sort } })).data
  );
}

/**
 *
 * @param {{ nickname: string, realname: string, sex: 'm' | 'f' }} sender
 * @param {sender} receiver
 * @param {string} text
 */
export async function createConfession(sender, receiver, text) {
  return await instance.post("confessions", { sender, receiver, text });
}

/**
 *
 * @param {number} id
 */
export async function delConfession(id) {
  return await instance.delete(`confessions/${id}`);
}

/**
 *
 * @param {number} confession
 */
export async function createLike(confession) {
  await instance.post(`confessions/${confession}/likes`);
}

/**
 *
 * @typedef {{ id: number, text: string, creationTime: string }} Comment
 * @param {number} confession
 * @returns {Promise<{ data: Object<number, Comment>, totalPages: number }>}
 */
export async function getComments(confession, page = 1) {
  return toCamelCase(
    (await instance.get(`confessions/${confession}/comments/pages/${page}`))
      .data
  );
}

/**
 *
 * @param {number} confession
 * @param {string} text
 */
export async function createComment(confession, text) {
  return await instance.post(`confessions/${confession}/comments`, { text });
}

/**
 * 
 * @param {number} confessions 
 * @param {number} comment 
 */
export async function delComment(confession, comment) {
  return await instance.delete(`confessions/${confession}/comments/${comment}`)
}

/**
 *
 * @param {string} username
 * @param {string} password
 */
export async function login(username, password) {
  return await instance.post("auth", { action: "login", username, password });
}

export async function logout() {
  return await instance.post("auth", { action: "logout" });
}
