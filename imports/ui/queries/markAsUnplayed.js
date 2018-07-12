import gql from "graphql-tag";

export default gql`
  mutation MarkAsUnplayed($podcastId: Int!, $id: String!) {
    markAsUnplayed(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;
