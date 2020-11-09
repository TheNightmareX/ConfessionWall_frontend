import { session } from "./serializers";

const storage = {
  /** @type {Set<number>} */
  liked: new Set(session.liked || []),
  /** @type {Set<number>} */
  commented: new Set(session.commented || []),
  confessionCount: session.confessionCount || 0,
};

let save = true;

window.reset = () => {
  save = false;
  location.reload();
};

window.addEventListener("unload", () => {
  if (!save) return;
  session.liked = [...storage.liked];
  session.commented = [...storage.commented];
  session.confessionCount = storage.confessionCount;
});

export default storage;
