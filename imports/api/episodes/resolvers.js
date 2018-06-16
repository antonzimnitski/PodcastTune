export default {
  Episode: {
    id: data => data.id,
    podcastId: data => data.podcastId,
    podcastArtworkUrl: data => data.podcastArtworkUrl,
    title: data => data.title,
    description: data => data.description,
    author: data => data.author,
    mediaUrl: data => data.mediaUrl,
    playedSeconds: () => 0,
    duration: data => data.duration,
    pubDate: data => data.pubDate,
    linkToEpisode: data => data.linkToEpisode
  }
};
