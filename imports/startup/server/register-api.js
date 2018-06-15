import { createApolloServer } from "meteor/apollo";
import { makeExecutableSchema } from "graphql-tools";
import merge from "lodash/merge";

//da342ddadsdazzvczcxvcxzdsdaadadavcxxcvxc
import PodcastsPreviewsSchema from "./../../api/podcastsPreviews/PodcastPreview.graphql";
import PodcastsPreviewsResolvers from "./../../api/podcastsPreviews/resolvers";

import GenresSchema from "./../../api/genres/Genre.graphql";
import GenresResolvers from "./../../api/genres/resolvers";

import PodcastSchema from "./../../api/podcasts/Podcast.graphql";
import PodcastResolvers from "./../../api/podcasts/resolvers";

import EpisodeSchema from "./../../api/episodes/Episode.graphql";
import EpisodeResolvers from "./../../api/episodes/resolvers";

import SearchPreviewsSchema from "./../../api/searchPreviews/SearchPreview.graphql";
import SearchPreviewsResolvers from "./../../api/searchPreviews/resolvers";

const typeDefs = [
  GenresSchema,
  PodcastsPreviewsSchema,
  PodcastSchema,
  EpisodeSchema,
  SearchPreviewsSchema
];

const resolvers = merge(
  PodcastsPreviewsResolvers,
  GenresResolvers,
  PodcastResolvers,
  EpisodeResolvers,
  SearchPreviewsResolvers
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

createApolloServer({ schema });
