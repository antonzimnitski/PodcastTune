import gql from "graphql-tag";

export default gql`
  query PodcastsPreviews($genreId: String!, $limit: Int) {
    podcastsPreviews(genreId: $genreId, limit: $limit) {
      id
      name
      artworkUrl
      summary
    }
  }
`;
