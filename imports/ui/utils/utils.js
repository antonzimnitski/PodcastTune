import { Session } from "meteor/session";

export function setValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  Session.set(key, JSON.parse(localStorage.getItem(key)));
}

export function queueSplice(queue, index) {
  queue.unshift(...queue.splice(index, 1));
  return queue;
}
