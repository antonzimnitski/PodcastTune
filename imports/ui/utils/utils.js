import { Session } from "meteor/session";

export function setValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  Session.set(key, JSON.parse(localStorage.getItem(key)));
}
