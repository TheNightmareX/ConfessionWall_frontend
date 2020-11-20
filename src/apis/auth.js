import axios from "axios";
import { api } from "./index";

export default new (class {
  /**
   *
   * @param {string} username
   * @param {string} password
   * @returns {string} username
   */
  @api
  login(username, password) {
    return axios.post("auth", { action: "login", username, password });
  }
  /**
   *
   * @returns {string} username
   */
  @api
  logout() {
    return axios.post("auth", { action: "logout" });
  }
})();
