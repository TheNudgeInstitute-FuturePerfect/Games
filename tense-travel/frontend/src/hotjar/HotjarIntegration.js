import hotjarLib from "./react-hotjar";

const hj = (...params) => {
  if (!window.hj) {
    throw new Error("Hotjar is not initialized");
  }
  window.hj(...params);
};

export const hotjar = {
  initialize(
    id = process.env.REACT_APP_SITE_ID,
    sv = process.env.REACT_APP_HOTJAR_VERSION
  ) {
    hotjarLib(id, sv);
  },
  initialized() {
    return typeof window !== "undefined" && typeof window.hj === "function";
  },
  identify(userId, properties) {
    hj("identify", userId, properties);
  },
  event(event) {
    hj("event", event);
  },
  stateChange(relativePath) {
    hj("stateChange", relativePath);
  },
};
