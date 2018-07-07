import UsersData from "./usersData";
import Podcasts from "./../podcasts/podcasts";

export default {
  Query: {
    podcasts(_, __, { user }, { cacheControl }) {
      const { _id } = user;
      cacheControl.setCacheHint({ maxAge: 0 });
      const userData = UsersData.findOne({ _id });
      if (!userData || !userData.podcasts) return null;
      return userData.podcasts.map(podcastId => {
        return Podcasts.findOne({ podcastId });
      });
    },
    playingEpisode(_, __, { user }, { cacheControl }) {
      const { _id } = user;
      cacheControl.setCacheHint({ maxAge: 0 });
      const userData = UsersData.findOne({ _id });
      if (!userData || !userData.playingEpisode) return null;
      const { id, podcastId } = userData.playingEpisode;
      const podcast = Podcasts.findOne({ podcastId });
      if (podcast.episodes) {
        return podcast.episodes.find(el => el.id === id);
      }
    },
    upnext(_, __, { user }, { cacheControl }) {
      const { _id } = user;
      if (!_id) return null;
      cacheControl.setCacheHint({ maxAge: 0 });
      const userData = UsersData.findOne({ _id });
      if (!userData || !userData.upnext) return null;
      const { upnext } = userData;
      return !upnext.length
        ? null
        : upnext.map(({ podcastId, id }) => {
            const podcast = Podcasts.findOne({ podcastId });
            if (podcast.episodes) {
              return podcast.episodes.find(el => el.id === id);
            }
          });
    }
  },
  Mutation: {
    subscribe(_, { podcastId }, { user }) {
      const { _id } = user;
      UsersData.update(
        { _id },
        { $addToSet: { podcasts: podcastId } },
        { upsert: true }
      );
      return podcastId;
    },
    unsubscribe(_, { podcastId }, { user }) {
      const { _id } = user;
      UsersData.update({ _id }, { $pull: { podcasts: podcastId } });
      return podcastId;
    },
    setPlayingEpisode(_, { id, podcastId }, { user }) {
      const { _id } = user;
      const userData = UsersData.findOne({ _id });

      if (userData && userData.playingEpisode) {
        UsersData.update({ _id }, { $pull: { upnext: { id } } });
        UsersData.update(
          { _id },
          {
            $push: {
              upnext: { $each: [userData.playingEpisode], $position: 0 }
            }
          }
        );
      }

      UsersData.update(
        { _id },
        { $set: { playingEpisode: { id, podcastId } } },
        { upsert: true }
      );
      return { id, podcastId };
    },
    updatePlayedSeconds(_, { id, playedSeconds }, { user }) {
      const { _id } = user;
      //https://stackoverflow.com/questions/37427610/mongodb-update-or-insert-object-in-array#37428056
      UsersData.update({ _id }, { $pull: { inProgress: { id } } });
      UsersData.update(
        { _id },
        { $push: { inProgress: { id, playedSeconds } } }
      );
      return playedSeconds;
    }
  }
};
