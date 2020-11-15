import { convertCase } from "./index";
import axios from "axios";

/**@typedef {{ id: number, text: string, creationTime: string }} Comment */

/**
 * @param {number} confession
 * @returns {Promise<{ results: Object<number, Confession> , count: number, next: string, previous: string }>}
 */
export async function list(confession, page = 1) {
  return convertCase(
    (await axios.get("comments/", { params: { confession, page } })).data,
    "camel"
  );
}

/**
 *
 * @param {number} confession
 * @param {string} text
 */
export async function create(confession, text) {
  return await axios.post("comments/", { confession, text });
}

/**
 *
 * @param {number} comment
 */
export async function destroy(comment) {
  return await axios.delete(`comments/${comment}`);
}
