import gql from "graphql-tag";

export default gql`
  query Feed($podcastId: Int!, $offset: Int!, $limit: Int!) {
    podcast(podcastId: $podcastId) {
      updatedAt
    }

    feed(podcastId: $podcastId, offset: $offset, limit: $limit) {
      id
      podcastId
      title
      pubDate
      duration
      inFavorites
      inUpnext
      isPlayed
    }
  }
`;
