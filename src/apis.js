import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NODE_ENV == 'production' ? '' : 'http://localhost:8000/api/',
    xsrfCookieName: 'csrftokan',
    xsrfHeaderName: 'X-CSRFToken'
})

export function getConfessions(page = 1) {
    return instance.get('confessions', {
        params: {
            page
        }
    });
}

export function createConfession(data) {
    return instance.post('confessions', data);
}

export function createLike(id) {
    return instance.post('confessions/likes', {
        id
    })
}