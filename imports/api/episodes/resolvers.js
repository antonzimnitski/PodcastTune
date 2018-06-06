export default {
  Episode: {
    title: data => data.title,
    description: data => data.description,
    mediaUrl: data => data.mediaUrl,
    pubDate: data => data.pubDate,
    linkToEpisode: data => data.linkToEpisode
  }
};
