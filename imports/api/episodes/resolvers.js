export default {
  Episode: {
    title: data => data.title,
    description: data => data.description,
    author: data => data.author,
    mediaUrl: data => data.mediaUrl,
    pubDate: data => data.pubDate,
    linkToEpisode: data => data.linkToEpisode
  }
};
