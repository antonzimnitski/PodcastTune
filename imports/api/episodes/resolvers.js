export default {
  Episode: {
    title: data => checkForDuplicates(data.title),
    pubDate: data => data.pubDate,
    description: data => data.description,
    duration: data => data.duration,
    mediaUrl: data => data.enclosure._url,
    summary: data => data.summary
  }
};

function checkForDuplicates(data) {
  return Array.isArray(data) ? data[0] : data;
}
