import axios from "axios";

export default {
  Query: {
    searchPreviews(obj, { searchTerm }) {
      return axios
        .get(
          `https://podcast-rest-api.herokuapp.com/api/lookup/${encodeURIComponent(
            searchTerm
          )}`
        )
        .then(res => res.data.data);
    }
  }
};
