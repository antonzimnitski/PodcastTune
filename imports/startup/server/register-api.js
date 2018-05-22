import { createApolloServer } from "meteor/apollo";
import { makeExecutableSchema } from "graphql-tools";
import merge from "lodash/merge";

import PodcastsPreviewsSchema from "./../../api/podcasts/PodcastPreview.graphql";
import PodcastsPreviewsResolvers from "./../../api/podcasts/resolvers";
//dadas
const typeDefs = [PodcastsPreviewsSchema];

const resolvers = merge(PodcastsPreviewsResolvers);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

createApolloServer({ schema });
