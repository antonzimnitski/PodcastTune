import { createApolloServer } from "meteor/apollo";
import { makeExecutableSchema } from "graphql-tools";
import merge from "lodash/merge";

//da342ddsdazc746bxcvczcxvvcxxcvxc
import PodcastsPreviewsSchema from "./../../api/podcastsPreviews/PodcastPreview.graphql";
import PodcastsPreviewsResolvers from "./../../api/podcastsPreviews/resolvers";

import GenresSchema from "./../../api/genres/Genre.graphql";
import GenresResolvers from "./../../api/genres/resolvers";

import PodcastSchema from "./../../api/podcasts/Podcast.graphql";
import PodcastResolvers from "./../../api/podcasts/resolvers";

import EpisodeSchema from "./../../api/episodes/Episode.graphql";
import EpisodeResolvers from "./../../api/episodes/resolvers";

const typeDefs = [
  GenresSchema,
  PodcastsPreviewsSchema,
  PodcastSchema,
  EpisodeSchema
];

const resolvers = merge(
  PodcastsPreviewsResolvers,
  GenresResolvers,
  PodcastResolvers,
  EpisodeResolvers
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

createApolloServer({ schema });
