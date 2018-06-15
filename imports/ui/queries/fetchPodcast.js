import gql from "graphql-tag";

export default gql`
  query Podcast($podcastId: Int!) {
    podcast(podcastId: $podcastId) {
      podcastId
      feedUrl
      title
      author
      website
      description
      summary
      artworkUrl
      episodes {
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
  }
`;
