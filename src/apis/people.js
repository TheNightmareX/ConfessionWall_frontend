import axios from "axios";
import { api } from "./index";

/**@typedef {{id?: number, displayName: string, sex: 'M' | 'F' | 'X'}} Person */

export default new (class {
  /**
   *
   * @param {Person} person
   * @returns {number}
   */
  @api
  queryID(person) {
    return axios.get("people/id", { params: person });
  }
  /**
   *
   * @param {number} id
   * @returns {Person}
   */
  @api
  retrieve(id) {
    return axios.get(`people/${id}`);
  }
  /**
   *
   * @param {string} displayName - At least 2 letters.
   * @returns {{count: number, next: string, previous: string, results: Object<number, Person>}}
   */
  @api
  search(displayName) {
    return axios.get("people/", { params: { contains: displayName } });
  }
  /**
   *
   * @param {Person} person
   * @returns {Person}
   */
  @api
  create(person) {
    return axios.post("people/", person);
  }
})();
