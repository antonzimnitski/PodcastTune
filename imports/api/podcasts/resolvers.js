import axios from "axios";
import moment from "moment";
import Podcasts from "./podcasts";
import UsersData from "./../usersData/usersData";

export default {
  Query: {
    async podcast(obj, { podcastId }) {
      console.time("podcast");
      const result = Podcasts.findOne({ podcastId });

      if (!result) {
        const podcast = await getData(podcastId);

        if (!podcast) return null;
        Podcasts.update(
          { podcastId },
          { ...podcast, updatedAt: moment().valueOf() },
          { upsert: true }
        );
        console.timeEnd("podcast");
        return Podcasts.findOne({ podcastId });
      }

      if (isUpdateNeeded(result.updatedAt)) {
        const podcast = await getData(podcastId);

        if (!podcast || !podcast.episodes) return null;
        podcast.episodes.forEach(episode => {
          if (!episode || !episode.mediaUrl) return;
          Podcasts.update(
            { podcastId, "episodes.mediaUrl": { $ne: episode.mediaUrl } },
            { $push: { episodes: episode } }
          );
        });
        Podcasts.update(
          { podcastId },
          {
            $set: { updatedAt: moment().valueOf() }
          }
        );
        console.timeEnd("podcast");
        return Podcasts.findOne({ podcastId });
      }
      console.timeEnd("podcast");
      return result;
    }
  },
  Podcast: {
    subscribed: (data, _, { user }) => {
      if (!user) return false;
      const { _id } = user;
      const userData = UsersData.findOne({ _id });
      console.log(userData);
      if (!userData || !userData.podcasts) return false;
      console.log(userData.podcasts);
      return !!userData.podcasts.find(el => el === data.podcastId);
    }
  }
};

function getData(podcastId) {
  return axios
    .get(`https://podcast-rest-api.herokuapp.com/api/podcasts/${podcastId}`)
    .then(res => res.data.data);
}

function isUpdateNeeded(time) {
  return moment(moment().valueOf()).diff(time, "hours") >= 1;
}
