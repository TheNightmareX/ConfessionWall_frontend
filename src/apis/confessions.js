import axios from "axios";
import { api } from "./index";

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

export default new (class {
  /**
   *
   * @param {number} id
   * @returns {Confession}
   */
  @api
  retrieve(id) {
    return axios.get(`confessions/${id}`);
  }
  /**
   *
   * @param {number} page
   * @param {'latest' | 'earlest' | 'hottest' | 'coldest'} sort
   * @param {number} person - ID
   * @returns {Promise<{ results: Object<number, Confession> , count: number, next: string, previous: string }>}
   */
  @api
  list(page = 1, sort = "latest", person = undefined) {
    return axios.get(`confessions/`, { params: { page, sort, person } });
  }
  /**
   *
   * @param {number} sender - pk
   * @param {number} receiver - pk
   * @param {string} text
   */
  @api
  create(sender, receiver, text) {
    return axios.post("confessions/", { sender, receiver, text });
  }
  /**
   *
   * @param {number} id
   */
  @api
  destroy(id) {
    return axios.delete(`confessions/${id}`);
  }
})();