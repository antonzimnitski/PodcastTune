import gql from "graphql-tag";

export default gql`
  query PlayingEpisode {
    playingEpisode @client {
      id
      podcastId
      podcastArtworkUrl
      title
      mediaUrl
      pubDate
      playedSeconds
      author
    }
  }
`;
