import gql from "graphql-tag";

export default gql`
  mutation PpdateLocalPlayedSeconds($id: String!, $playedSeconds: Float!) {
    updateLocalPlayedSeconds(id: $id, playedSeconds: $playedSeconds) @client
  }
`;
