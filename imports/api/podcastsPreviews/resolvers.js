import axios from "axios";
import fs from "fs";

export default {
  Query: {
    podcastsPreviews(obj, { genreId, limit = 100 }) {
      return axios
        .get(`https://podcast-rest-api.herokuapp.com/api/genres/${genreId}`)
        .then(res => {
          return res.data.previews;
        });
    }
  }
};
