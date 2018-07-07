import React from "react";
import ModalItem from "./ModalItem";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

const UpNextPopup = ({ upnext, isLoggedIn, setPlayingEpisode }) => {
  const handleClick = (id, podcastId) => {
    isLoggedIn
      ? setPlayingEpisode({
          variables: {
            id,
            podcastId
          },
          refetchQueries: [
            { query: GET_PLAYING_EPISODE },
            { query: GET_UPNEXT }
          ]
        })
          .then(res => console.log("success", res.data))
          .catch(err => console.log(err))
      : console.log("todo it later", id, podcastId);
  };

  if (!upnext || upnext.length === 0) {
    return (
      <div className="up-next__empty">
        <h2 className="up-next__title">Your Up Next is Empty</h2>
        <p className="empty__text">Add some episodes</p>
      </div>
    );
  }
  return (
    <React.Fragment>
      <h2 className="up-next__title">Up Next</h2>
      <div className="modal__list">
        {upnext.map(episode => {
          if (!episode) return;
          return (
            <div
              key={episode.id}
              className="modal__item"
              onClick={() => handleClick(episode.id, episode.podcastId)}
            >
              <ModalItem item={episode} playIcon={true} />
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

const GET_UPNEXT = gql`
  query Upnext {
    upnext {
      id
      podcastId
      podcastArtworkUrl
      title
      author
    }
  }
`;

const SET_PLAYING_EPISODE = gql`
  mutation SetPlayingEpisode($id: String!, $podcastId: Int!) {
    setPlayingEpisode(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;

const GET_PLAYING_EPISODE = gql`
  query PlayingEpisode {
    playingEpisode {
      id
      podcastId
      podcastArtworkUrl
      title
      mediaUrl
      pubDate
      playedSeconds
      author
    }
  }
`;

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(GET_UPNEXT, {
      props: ({ data: { upnext } }) => ({
        upnext
      })
    }),
    graphql(SET_PLAYING_EPISODE, { name: "setPlayingEpisode" })
  )(UpNextPopup)
);
