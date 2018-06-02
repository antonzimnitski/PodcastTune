import axios from "axios";
import fs from "fs";

export default {
  Query: {
    podcastsPreviews(obj, { genreId, limit = 100 }) {
      return axios
        .get(`https://podcast-rest-api.herokuapp.com/api/genres/${genreId}`)
        .then(res => {
          writeTofile(res.data);
          return res.data.previews;
        });
    }
  }
};

function writeTofile(data) {
  fs.writeFile(
    "C:/Web/data/data-from-api.json",
    JSON.stringify(data),
    (err, res) => {
      if (!err) console.log("HELLLLLLLLLp");
    }
  );
}
