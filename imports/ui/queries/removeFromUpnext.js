import gql from "graphql-tag";

export default gql`
  mutation RemoveFromUpnext($id: String!, $podcastId: Int!) {
    removeFromUpnext(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;
