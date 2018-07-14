import moment from "moment";
import UsersData from "./usersData";
import Podcasts from "./../podcasts/podcasts";

function getUserData(_id, field) {
  const userData = UsersData.findOne({ _id });
  if (!userData || !userData[field]) return null;
  return userData[field];
}

function getEpisode(podcastId, id) {
  const podcast = Podcasts.findOne({ podcastId });
  if (podcast.episodes) {
    return podcast.episodes.find(el => el.id === id);
  }
  return null;
}

export default {
  Query: {
    podcasts(_, __, { user }) {
      if (!user) return null;
      const podcasts = getUserData(user._id, "podcasts");

      if (!podcasts || !podcasts.length) return null;

      return podcasts.map(podcastId => {
        return Podcasts.findOne({ podcastId });
      });
    },
    playingEpisode(_, __, { user }) {
      if (!user) return null;
      const { _id } = user;
      const playingEpisode = getUserData(_id, "playingEpisode");

      if (!playingEpisode) {
        const upnext = getUserData(_id, "upnext");
        if (!upnext || !upnext.length) return null;
        const { id, podcastId } = upnext[0];
        UsersData.update(
          { _id },
          {
            $set: { playingEpisode: { id, podcastId } },
            $pull: { upnext: { id } }
          }
        );
        return getEpisode(podcastId, id);
      }

      const { id, podcastId } = playingEpisode;

      return getEpisode(podcastId, id);
    },
    newReleases(_, __, { user }) {
      if (!user) return null;
      const podcasts = getUserData(user._id, "podcasts");

      if (!podcasts || !podcasts.length) return null;

      let result = [];

      podcasts.forEach(podcast => {
        const podcastData = Podcasts.findOne({ podcastId: podcast });
        if (podcastData.episodes) {
          const newEpisodes = podcastData.episodes.filter(episode => {
            if (episode) return validForNewReleases(episode.pubDate);
          });
          Array.prototype.push.apply(result, newEpisodes);
        }
      });

      return result;
    },
    upnext(_, __, { user }) {
      if (!user) return null;
      const upnext = getUserData(user._id, "upnext");

      return !upnext || !upnext.length
        ? null
        : upnext.map(({ podcastId, id }) => getEpisode(podcastId, id));
    },
    inProgress(_, __, { user }) {
      if (!user) return null;
      const inProgress = getUserData(user._id, "inProgress");

      return !inProgress || !inProgress.length
        ? null
        : inProgress.map(({ podcastId, id }) => getEpisode(podcastId, id));
    },
    favorites(_, __, { user }) {
      if (!user) return null;
      const favorites = getUserData(user._id, "favorites");
      return !favorites || !favorites.length
        ? null
        : favorites.map(({ podcastId, id }) => getEpisode(podcastId, id));
    },
    played(_, __, { user }) {
      if (!user) return null;
      const played = getUserData(user._id, "played");
      return !played || !played.length
        ? null
        : played.map(({ podcastId, id }) => getEpisode(podcastId, id));
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
      return Podcasts.findOne({ podcastId });
    },
    unsubscribe(_, { podcastId }, { user }) {
      const { _id } = user;
      UsersData.update({ _id }, { $pull: { podcasts: podcastId } });
      return Podcasts.findOne({ podcastId });
    },
    clearPlayingEpisode(_, __, { user }) {
      const { _id } = user;
      UsersData.update({ _id }, { $set: { playingEpisode: null } });
      return null;
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
        {
          $set: { playingEpisode: { id, podcastId } },
          $pull: { played: { id } }
        },
        { upsert: true }
      );
      return getEpisode(podcastId, id);
    },
    updatePlayedSeconds(_, { id, podcastId, playedSeconds }, { user }) {
      const { _id } = user;
      //https://stackoverflow.com/questions/37427610/mongodb-update-or-insert-object-in-array#37428056
      UsersData.update(
        { _id },
        {
          $pull: { inProgress: { id } }
        }
      );
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
      return getEpisode(podcastId, id);
    },
    removeFromUpnext(_, { id, podcastId }, { user }) {
      const { _id } = user;
      const userData = UsersData.findOne({ _id });

      if (userData) {
        UsersData.update({ _id }, { $pull: { upnext: { id } } });
      }
      return getEpisode(podcastId, id);
    },
    addToFavorites(_, { id, podcastId }, { user }) {
      const { _id } = user;

      UsersData.update(
        { _id },
        { $addToSet: { favorites: { id, podcastId } } },
        { upsert: true }
      );
      return getEpisode(podcastId, id);
    },
    removeFromFavorites(_, { id, podcastId }, { user }) {
      const { _id } = user;
      const userData = UsersData.findOne({ _id });

      if (userData) {
        UsersData.update({ _id }, { $pull: { favorites: { id } } });
      }
      return getEpisode(podcastId, id);
    },
    markAsPlayed(_, { id, podcastId }, { user }) {
      const { _id } = user;

      UsersData.update(
        { _id },
        {
          $pull: { inProgress: { id } },
          $addToSet: { played: { id, podcastId } }
        },
        { upsert: true }
      );
      return getEpisode(podcastId, id);
    },
    markAsUnplayed(_, { id, podcastId }, { user }) {
      const { _id } = user;
      const userData = UsersData.findOne({ _id });

      if (userData) {
        UsersData.update({ _id }, { $pull: { played: { id } } });
      }
      return getEpisode(podcastId, id);
    }
  }
};

function validForNewReleases(date) {
  if (moment(date).isValid()) {
    return moment(moment().valueOf()).diff(date, "days") <= 14;
  }
  return false;
}
