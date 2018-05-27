import axios from "axios";

export default {
  Query: {
    podcastsPreviews(obj, { genreId, limit = 100 }) {
      return axios
        .get(
          `https://itunes.apple.com/us/rss/topaudiopodcasts/limit=${limit}/genre=${genreId}/json`
        )
        .then(res => {
          return res.data.feed.entry;
        });
    }
  },
  PodcastPreview: {
    id: data => getId(data),
    name: data => getName(data),
    artworkUrl: data => getArtwork(data),
    summary: data => getSummary(data)
  }
};

function getId(data) {
  return data["id"].attributes["im:id"];
}

function getName(data) {
  return data["im:name"].label;
}
function getArtwork(data) {
  return data["im:image"][data["im:image"].length - 1].label;
}

function getSummary(data) {
  return data["summary"] ? data["summary"].label : null;
}
