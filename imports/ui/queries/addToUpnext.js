import gql from "graphql-tag";

export default gql`
  mutation AddToUpnext($id: String!, $podcastId: Int!) {
    addToUpnext(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;
