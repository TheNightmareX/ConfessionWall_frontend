import { api } from "./index";
import axios from "axios";

/**@typedef {{ id: number, text: string, creationTime: string }} Comment */

export default new (class {
  /**
   * @param {number} confession
   * @returns {Promise<{ results: Object<number, Confession> , count: number, next: string, previous: string }>}
   */
  @api
  list(confession, page = 1) {
    return axios.get("comments/", { params: { confession, page } });
  }
  /**
   *
   * @param {number} confession
   * @param {string} text
   */
  @api
  create(confession, text) {
    return axios.post("comments/", { confession, text });
  }
  /**
   *
   * @param {number} comment
   */
  @api
  destroy(comment) {
    return axios.delete(`comments/${comment}/`);
  }
})();
