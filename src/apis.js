import axios from "axios"

const instance = axios.create({
    baseURL: process.env.NODE_ENV == 'production' ? '/api/' : 'http://localhost:8000/api/',
    xsrfCookieName: 'csrftokan',
    xsrfHeaderName: 'X-CSRFToken'
})

/**
 * 
 * @typedef {{ id: number, sender: { nickname: string, sex: 'm' | 'f' }, receiver: data[0]['sender'], creation_time: string, text: string, likes: number, comments: number }} Confession
 * @returns {Promise<{ data: Confession[] , total_pages: number }>}
 */
export async function getConfessions(page = 1) {
    return (await instance.get('confessions', { params: { page } })).data
}
/**
 * 
 * @param {{ nickname: string, realname: string, sex: 'm' | 'f' }} sender
 * @param {sender} receiver
 * @param {string} text
 */
export async function createConfession(sender, receiver, text) {
    await instance.post('confessions', { sender, receiver, text })
}

/**
 * 
 * @param {number} confession 
 */
export async function createLike(confession) {
    await instance.post('confessions/likes', {
        confession
    })
}

/**
 * 
 * @typedef {{ id: number, text: string, creation_time: string }} Comment
 * @param {number} confession 
 * @returns {Promise<{{ data: Comment[], total_pages: number }}>}
 */
export async function getComments(confession, page = 1) {
    return (await instance.get('confessions/comments', { params: { confession, page } })).data
}

/**
 * 
 * @param {number} confession 
 * @param {string} text 
 */
export async function createComment(confession, text) {
    await instance.post('confessions/comments', { confession, text })
}
