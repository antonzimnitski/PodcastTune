import axios from "axios";
import values from "lodash/values";

export default {
  Query: {
    genres() {
      return axios
        .get(
          "https://itunes.apple.com/WebObjects/MZStoreServices.woa/ws/genres?id=26"
        )
        .then(res => values(res.data[26]["subgenres"]));
    }
  },
  Genre: {
    subgenres: genre => values(genre["subgenres"])
  }
};
