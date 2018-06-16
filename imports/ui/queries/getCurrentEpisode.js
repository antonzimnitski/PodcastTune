import gql from "graphql-tag";

export default gql`
  query {
    currentEpisode @client {
      id
      podcastId
      podcastArtworkUrl
      title
      description
      author
      mediaUrl
      playedSeconds
      duration
      pubDate
      linkToEpisode
    }
  }
`;
