import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

const UsersData = new Mongo.Collection("usersData");

if (Meteor.isServer) {
  Meteor.publish("usersData", function() {
    return UsersData.find({ _id: this.userId });
  });
}

export default UsersData;
