import gql from "graphql-tag";

export default gql`
  query Podcast($podcastId: Int!) {
    podcast(podcastId: $podcastId) {
      podcastId
      feedUrl
      title
      author
      website
      description
      summary
      artworkUrl
    }
  }
`;

// import gql from "graphql-tag";

// export default gql`
//   query Podcast($podcastId: Int!, $offset: Int!, $limit: Int!) {
//     podcast(podcastId: $podcastId) {
//       podcastId
//       feedUrl
//       title
//       author
//       website
//       description
//       summary
//       artworkUrl
//     }

//     feed(podcastId: $podcastId, offset: $offset, limit: $limit) {
//       id
//       title
//       pubDate
//       duration
//     }
//   }
// `;
