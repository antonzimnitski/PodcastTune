import Podcasts from "./../podcasts/podcasts";

export default {
  Query: {
    feed(_, { podcastId, offset, limit }) {
      const podcast = Podcasts.findOne({ podcastId });
      if (podcast.episodes) {
        return podcast.episodes.slice(offset, offset + limit);
      }
    },
    episode(_, { podcastId, id }) {
      const podcast = Podcasts.findOne({ podcastId });
      if (podcast.episodes) {
        return podcast.episodes.find(el => el.id === id);
      }
    }
  },
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
