import gql from "graphql-tag";

export default gql`
  query Podcast($podcastId: String!) {
    podcast(podcastId: $podcastId) {
      podcastId
      feedUrl
      title
      author
      website
      description
      summary
      artwork
      episodes {
        title
        description
        author
        mediaUrl
        pubDate
        linkToEpisode
      }
    }
  }
`;
