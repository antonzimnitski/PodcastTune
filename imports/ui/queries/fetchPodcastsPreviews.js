import gql from "graphql-tag";

export default gql`
  query PodcastsPreviews($genreId: String!) {
    podcastsPreviews(genreId: $genreId) {
      id
      name
      artworkUrl
      itunesUrl
      summary
    }
  }
`;
