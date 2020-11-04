const local = new Proxy(sessionStorage, {
  get: (target, p) => (p in target ? JSON.parse(target[p]) : undefined),
  set: (target, p, v) => {
    target[p] = JSON.stringify(v);
  },
});

const session = {
  /** @type {Set<number>} */
  liked: new Set(local.liked || []),
  /** @type {Set<number>} */
  commented: new Set(local.commented || []),
};

window.addEventListener("unload", () => {
  if (window.DONOTSAVE) return;
  if (window.CLEAR) {
    sessionStorage.clear();
    return;
  }
  local.liked = [...session.liked];
  local.commented = [...session.commented];
});
export default session;
