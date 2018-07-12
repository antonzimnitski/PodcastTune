import gql from "graphql-tag";

export default gql`
  mutation SetPlayingEpisode($id: String!, $podcastId: Int!) {
    setPlayingEpisode(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;
