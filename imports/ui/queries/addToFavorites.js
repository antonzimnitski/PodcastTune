import gql from "graphql-tag";

export default gql`
  mutation AddToFavorites($id: String!, $podcastId: Int!) {
    addToFavorites(podcastId: $podcastId, id: $id) {
      id
      podcastId
      podcastArtworkUrl
      duration
      title
      author
      pubDate
      isPlayed
      inUpnext
      inFavorites
    }
  }
`;
