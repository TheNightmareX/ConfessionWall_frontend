import { convertCase } from "./index";
import axios from "axios";

/**@typedef {{id?: number, displayName: string, sex: 'M' | 'F' | 'X'}} Person */

/**
 *
 * @param {Person} person
 * @returns {number}
 */
export async function queryID(person) {
  return (
    await axios.get("people/id", {
      params: convertCase(person, "snake"),
    })
  ).data;
}

/**
 * 
 * @param {number} id 
 * @returns {Person}
 */
export async function retrieve(id) {
  return convertCase((await axios.get(`people/${id}`)).data, 'camel')
}

/**
 *
 * @param {Person} person
 * @returns {person}
 */
export async function create(person) {
  return (await axios.post("people/", convertCase(person, "snake"))).data;
}
