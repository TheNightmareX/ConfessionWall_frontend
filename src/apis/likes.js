import axios from "axios";
import { api } from "./index";

export default new (class {
  /**
   *
   * @param {number} confession
   */
  @api
  create(confession) {
    return axios.post(`likes/`, { confession });
  }
})();
