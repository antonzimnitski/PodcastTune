import axios from "axios";

export default {
  Query: {
    podcast(obj, { podcastId }) {
      return axios
        .get(`https://podcast-rest-api.herokuapp.com/api/podcasts/${podcastId}`)
        .then(res => res.data.data);
    }
  }
};
