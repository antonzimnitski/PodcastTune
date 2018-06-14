import axios from "axios";

export default {
  Query: {
    podcastsPreviews(obj, { genreId }) {
      return axios
        .get(`https://podcast-rest-api.herokuapp.com/api/genres/${genreId}`)
        .then(res => {
          return res.data.previews;
        });
    }
  }
};
