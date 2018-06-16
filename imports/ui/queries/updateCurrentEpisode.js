import gql from "graphql-tag";

export default gql`
  mutation updateCurrentEpisode($episode: Episode!) {
    updateCurrentEpisode(episode: $episode) @client {
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
