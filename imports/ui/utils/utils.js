import { Session } from "meteor/session";

export function setValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  Session.set(key, JSON.parse(localStorage.getItem(key)));
}

export function placeEpisodeFirst(index) {
  const queue = Session.get("queue");
  queue.unshift(...queue.splice(index, 1));
  return queue;
}
