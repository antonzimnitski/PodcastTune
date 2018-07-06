import Podcasts from "./../podcasts/podcasts";
import UsersData from "./../usersData/usersData";

export default {
  Query: {
    feed(_, { podcastId, offset, limit }) {
      const podcast = Podcasts.findOne({ podcastId });
      if (podcast.episodes) {
        return podcast.episodes.slice(offset, offset + limit);
      }
    },
    episode(_, { podcastId, id }, { user }) {
      const podcast = Podcasts.findOne({ podcastId });
      if (podcast.episodes) {
        return podcast.episodes.find(el => el.id === id);
      }
    }
  },
  Episode: {
    podcastId: data => data.podcastId,
    podcastArtworkUrl: data => data.podcastArtworkUrl,
    title: data => data.title,
    description: data => data.description,
    author: data => data.author,
    mediaUrl: data => data.mediaUrl,
    playedSeconds: (data, _, { user }) => {
      const { _id } = user;
      const userData = UsersData.findOne({ _id });
      if (!userData || !userData.inProgress) return 0;
      const episodeData = userData.inProgress.find(el => el.id === data.id);
      return episodeData ? episodeData.playedSeconds : 0;
    },
    duration: data => data.duration,
    pubDate: data => data.pubDate,
    linkToEpisode: data => data.linkToEpisode
  }
};
