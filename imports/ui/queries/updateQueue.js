import gql from "graphql-tag";

export default gql`
  mutation updateQueue($episode: Episode!) {
    updateQueue(episode: $episode) @client {
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
