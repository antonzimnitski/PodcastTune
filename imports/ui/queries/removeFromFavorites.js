import gql from "graphql-tag";

export default gql`
  mutation RemoveFromFavorites($id: String!, $podcastId: Int!) {
    removeFromFavorites(podcastId: $podcastId, id: $id) {
      id
      podcastId
      inFavorites
    }
  }
`;
