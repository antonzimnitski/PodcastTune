import axios from "axios";
import moment from "moment";
import Podcasts from "./podcasts";

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
