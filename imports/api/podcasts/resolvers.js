import axios from "axios";

export default {
  Query: {
    podcastsPreviews(obj, { genreId }) {
      return axios
        .get(
          `https://itunes.apple.com/us/rss/topaudiopodcasts/limit=100/genre=${genreId}/json`
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
    itunesUrl: data => getItunesUrl(data),
    summary: data => getSummary(data),
    feedUrl: data => getFeedUrl(data, getId(data))
  }
};

function getId(data) {
  return data["id"].attributes["im:id"];
}

function getName(data) {
  return data["im:name"].label;
}
function getArtwork(data) {
  return data["im:image"][0].label;
}

function getItunesUrl(data) {
  return data["id"].label;
}

function getSummary(data) {
  return data["summary"] ? data["summary"].label : null;
}
function getFeedUrl(data, id) {
  return axios
    .get(`https://itunes.apple.com/lookup?id=${id}`)
    .then(res => res.data.results[0].feedUrl);
}
