export default {
  Episode: {
    id: data => data.id,
    title: data => data.title,
    description: data => data.description,
    author: data => data.author,
    mediaUrl: data => data.mediaUrl,
    pubDate: data => data.pubDate,
    linkToEpisode: data => data.linkToEpisode
  }
};
