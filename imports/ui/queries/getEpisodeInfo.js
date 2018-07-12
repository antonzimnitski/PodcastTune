import gql from "graphql-tag";

export default gql`
  query Episode($podcastId: Int!, $id: String!) {
    episode(podcastId: $podcastId, id: $id) {
      title
      description
      author
      duration
      pubDate
      linkToEpisode
    }
  }
`;
