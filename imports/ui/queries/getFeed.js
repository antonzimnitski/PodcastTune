import gql from "graphql-tag";

export default gql`
  query Feed($podcastId: Int!, $offset: Int!, $limit: Int!) {
    feed(podcastId: $podcastId, offset: $offset, limit: $limit) {
      id
      podcastId
      title
      pubDate
      duration
    }
  }
`;
