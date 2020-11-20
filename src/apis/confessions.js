import axios from "axios";
import { convertCase } from "./index";

/**
 *
 * @typedef {Object} Confession
 * @property {number} id
 * @property {number} sender
 * @property {number} receiver
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
export async function retrieve(id) {
  return convertCase((await axios.get(`confessions/${id}`)).data, "camel");
}
/**
 *
 * @param {number} page
 * @param {'latest' | 'earlest' | 'hottest' | 'coldest'} sort
 * @param {number} person - ID
 * @returns {Promise<{ results: Object<number, Confession> , count: number, next: string, previous: string }>}
 */
export async function list(page = 1, sort = "latest", person = undefined) {
  return convertCase(
    (await axios.get(`confessions/`, { params: { page, sort, person } })).data,
    "camel"
  );
}

/**
 *
 * @param {number} sender - pk
 * @param {number} receiver - pk
 * @param {string} text
 */
export async function create(sender, receiver, text) {
  return await axios.post("confessions/", { sender, receiver, text });
}

/**
 *
 * @param {number} id
 */
export async function destroy(id) {
  return await axios.delete(`confessions/${id}`);
}
