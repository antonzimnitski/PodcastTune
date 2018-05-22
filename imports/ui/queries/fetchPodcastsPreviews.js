import gql from "graphql-tag";

export default gql`
  query PodcastsPreviews {
    podcastsPreviews {
      id
      name
      artworkUrl
      itunesUrl
    }
  }
`;
