import gql from "graphql-tag";

export default gql`
  mutation MarkAsPlayed($podcastId: Int!, $id: String!) {
    markAsPlayed(podcastId: $podcastId, id: $id) {
      id
      podcastId
      isPlayed
    }
  }
`;
