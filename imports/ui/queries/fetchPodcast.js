import gql from "graphql-tag";

export default gql`
  query Podcast($podcastId: String!) {
    podcast(podcastId: $podcastId) {
      id
      title
      summary
      feed {
        title
        pubDate
        duration
        mediaUrl
      }
    }
  }
`;
