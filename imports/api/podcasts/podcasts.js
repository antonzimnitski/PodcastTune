import { Mongo } from "meteor/mongo";

const Podcasts = new Mongo.Collection("podcasts");

export default Podcasts;
