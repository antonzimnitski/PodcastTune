import UsersData from "./usersData";
import Podcasts from "./../podcasts/podcasts";

export default {
  Query: {
    podcasts(_, { _id }) {
      const userData = UsersData.findOne({ _id });
      if (!userData || !userData.podcasts) return null;
      return userData.podcasts.map(podcastId => {
        return Podcasts.findOne({ podcastId });
      });
    }
  },
  Mutation: {
    subscribe(_, { podcastId, _id }) {
      return UsersData.update(
        { _id },
        { $addToSet: { podcasts: podcastId } },
        { upsert: true }
      );
    }
  }
};
