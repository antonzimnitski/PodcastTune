import axios from "axios";

export default {
  Query: {
    genres() {
      return axios
        .get("https://podcast-rest-api.herokuapp.com/api/genres")
        .then(res => res.data.genres);
    }
  }
};
