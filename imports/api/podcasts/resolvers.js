import axios from "axios";
import moment from "moment";
import Podcasts from "./podcasts";

export default {
  Query: {
    async podcast(obj, { podcastId }) {
      const result = Podcasts.findOne({ podcastId });

      if (!result || isUpdateNeeded(result.updatedAt)) {
        const podcast = await getData(podcastId);

        if (!podcast) return null;
        Podcasts.update(
          { podcastId },
          { ...podcast, updatedAt: moment().valueOf() },
          { upsert: true }
        );
        return Podcasts.findOne({ podcastId });
      }

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
