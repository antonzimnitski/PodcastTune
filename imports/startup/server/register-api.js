import { createApolloServer } from "meteor/apollo";
import { makeExecutableSchema } from "graphql-tools";
import merge from "lodash/merge";

import PodcastsPreviewsSchema from "./../../api/podcasts/PodcastPreview.graphql";
import PodcastsPreviewsResolvers from "./../../api/podcasts/resolvers";

import GenresSchema from "./../../api/genres/Genre.graphql";
import GenresResolvers from "./../../api/genres/resolvers";

//daddsdazczxds
const typeDefs = [GenresSchema, PodcastsPreviewsSchema];

const resolvers = merge(PodcastsPreviewsResolvers, GenresResolvers);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

createApolloServer({ schema });
