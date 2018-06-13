import { Session } from "meteor/session";

export function setValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  Session.set(key, JSON.parse(localStorage.getItem(key)));
}

export function placeEpisodeFirst(index) {
  const feed = Session.get("feed");
  feed.unshift(...feed.splice(index, 1));
  return feed;
}
