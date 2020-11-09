const handler = {
  get: (target, p) => (p in target ? JSON.parse(target[p]) : undefined),
  set: (target, p, v) => {
    target[p] = JSON.stringify(v);
  },
};

export const session = new Proxy(sessionStorage, handler);
export const local = new Proxy(localStorage, handler);
