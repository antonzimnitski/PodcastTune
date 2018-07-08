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
    },
    inProgress(_, __, { user }, { cacheControl }) {
      const { _id } = user;
      if (!_id) return null;
      cacheControl.setCacheHint({ maxAge: 0 });
      const userData = UsersData.findOne({ _id });
      if (!userData || !userData.inProgress) return null;
      const { inProgress } = userData;
      return !inProgress.length
        ? null
        : inProgress.map(({ podcastId, id }) => {
            const podcast = Podcasts.findOne({ podcastId });
            if (podcast.episodes) {
              return podcast.episodes.find(el => el.id === id);
            }
          });
    },
    favorites(_, __, { user }, { cacheControl }) {
      const { _id } = user;
      if (!_id) return null;
      cacheControl.setCacheHint({ maxAge: 0 });
      const userData = UsersData.findOne({ _id });
      if (!userData || !userData.favorites) return null;
      const { favorites } = userData;
      return !favorites.length
        ? null
        : favorites.map(({ podcastId, id }) => {
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
    updatePlayedSeconds(_, { id, podcastId, playedSeconds }, { user }) {
      const { _id } = user;
      //https://stackoverflow.com/questions/37427610/mongodb-update-or-insert-object-in-array#37428056
      UsersData.update({ _id }, { $pull: { inProgress: { id } } });
      UsersData.update(
        { _id },
        { $push: { inProgress: { id, podcastId, playedSeconds } } }
      );
      return playedSeconds;
    },
    addToUpnext(_, { id, podcastId }, { user }) {
      const { _id } = user;

      UsersData.update(
        { _id },
        { $addToSet: { upnext: { id, podcastId } } },
        { upsert: true }
      );
      return { id, podcastId };
    },
    removeFromUpnext(_, { id, podcastId }, { user }) {
      const { _id } = user;
      const userData = UsersData.findOne({ _id });

      if (userData) {
        UsersData.update({ _id }, { $pull: { upnext: { id } } });
      }
      return { id, podcastId };
    },
    addToFavorites(_, { id, podcastId }, { user }) {
      const { _id } = user;

      UsersData.update(
        { _id },
        { $addToSet: { favorites: { id, podcastId } } },
        { upsert: true }
      );
      return { id, podcastId };
    },
    removeFromFavorites(_, { id, podcastId }, { user }) {
      const { _id } = user;
      const userData = UsersData.findOne({ _id });

      if (userData) {
        UsersData.update({ _id }, { $pull: { favorites: { id } } });
      }
      return { id, podcastId };
    }
  }
};
