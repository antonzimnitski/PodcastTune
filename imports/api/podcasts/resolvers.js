import axios from "axios";

export default {
  Query: {
    podcastsPreviews(obj, args) {
      return axios
        .get(
          "https://rss.itunes.apple.com/api/v1/us/podcasts/top-podcasts/all/100/explicit.json"
        )
        .then(res => {
          return res.data.feed.results;
        });
    }
  },
  PodcastPreview: {
    artworkUrl: podcast => podcast.artworkUrl100,
    itunesUrl: podcast => podcast.url
  }
};
