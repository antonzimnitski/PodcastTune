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
    }
  }
};
