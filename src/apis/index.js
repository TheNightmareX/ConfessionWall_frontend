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
  baseURL:
    process.env.NODE_ENV === "production"
      ? "/api/"
      : "http://localhost:8000/api/",
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
 * @returns {Promise<{ data: Object<number, Confession> , totalPages: number }>}
 */
export async function getConfessions(page = 1) {
  return toCamelCase(
    (await instance.get("confessions", { params: { page } })).data
  );
}
/**
 *
 * @param {{ nickname: string, realname: string, sex: 'm' | 'f' }} sender
 * @param {sender} receiver
 * @param {string} text
 */
export async function createConfession(sender, receiver, text) {
  await instance.post("confessions", { sender, receiver, text });
}

/**
 *
 * @param {number} confession
 */
export async function createLike(confession) {
  await instance.post("confessions/likes", {
    confession,
  });
}

/**
 *
 * @typedef {{ id: number, text: string, creationTime: string }} Comment
 * @param {number} confession
 * @returns {Promise<{ data: Object<number, Comment>, totalPages: number }>}
 */
export async function getComments(confession, page = 1) {
  return toCamelCase((
    await instance.get("confessions/comments", { params: { confession, page } })
  ).data);
}

/**
 *
 * @param {number} confession
 * @param {string} text
 */
export async function createComment(confession, text) {
  await instance.post("confessions/comments", { confession, text });
}
