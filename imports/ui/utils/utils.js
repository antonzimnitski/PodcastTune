export function queueSplice(queue, index) {
  queue.splice(index, 1);
  return queue;
}

export function setStorageValue(key, value) {
  //https://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage#2010948
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorageValue(key) {
  //https://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage#2010948
  return JSON.parse(localStorage.getItem(key));
}
