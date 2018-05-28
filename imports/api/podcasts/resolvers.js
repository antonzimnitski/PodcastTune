import axios from "axios";
import find from "lodash/find";
import X2JS from "x2js";
import IdUrlPairs from "./podcasts";

export default {
  Query: {
    async podcast(obj, { podcastId }) {
      const feedUrl = await getFeedUrl(podcastId);
      return await axios
        .get(feedUrl)
        .then(res => xml2json(res.data))
        .then(res => res.rss.channel);
    }
  },
  Podcast: {
    id: data => {
      return "id";
    },
    author: data => checkForDuplicates(data.author),
    feed: data => data.item,
    image: data => findProperty(data.image, "url"),
    link: data => findProperty(data.image, "link")
  }
};

function getFeedUrl(podcastId) {
  const pair = IdUrlPairs.findOne({ podcastId });

  if (!pair) {
    return axios
      .get(`https://itunes.apple.com/lookup?id=${podcastId}`)
      .then(res => {
        const feedUrl = res.data.results[0].feedUrl;
        IdUrlPairs.insert({
          podcastId,
          feedUrl
        });

        return feedUrl;
      });
  }

  return pair.feedUrl;
}

function xml2json(xml) {
  const x2js = new X2JS();
  return x2js.xml2js(xml);
}

function findProperty(data, property) {
  return Array.isArray(data) ? find(data, property)[property] : data;
}

function checkForDuplicates(data) {
  return Array.isArray(data) ? data[0].toString() : data;
}
