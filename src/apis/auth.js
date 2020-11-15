import axios from "axios";

/**
 *
 * @param {string} username
 * @param {string} password
 * @returns {string} username
 */
export async function login(username, password) {
  return (await axios.post("auth", { action: "login", username, password }))
    .data;
}

/**
 *
 * @returns {string} username
 */
export async function logout() {
  return await axios.post("auth", { action: "logout" });
}
