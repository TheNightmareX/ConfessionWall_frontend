import axios from "axios";

/**
 *
 * @param {number} confession
 */
export async function create(confession) {
  await axios.post(`likes/`, { confession });
}
