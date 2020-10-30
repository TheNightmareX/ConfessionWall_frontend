const local = new Proxy(sessionStorage, {
    get: (target, p) => p in target ? JSON.parse(target[p]) : undefined,
    set: (target, p, v) => target[p] = JSON.stringify(v),
})

/**@type {Set<number>} */
export const liked = new Set(local.liked || [])

window.addEventListener('unload', () => {
    if (window.DONOTSAVE) return
    if (window.CLEAR) return sessionStorage.clear()
    local.liked = [...liked]
})