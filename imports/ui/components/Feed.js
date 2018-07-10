import React, { Component } from "react";
import { Session } from "meteor/session";
import EpisodeModal from "./helpers/EpisodeModal";
import { Query, graphql, compose } from "react-apollo";
import updateCurrentEpisode from "./../queries/updateCurrentEpisode";
import getCurrentEpisode from "./../queries/getCurrentEpisode";
import gql from "graphql-tag";
import { withTracker } from "meteor/react-meteor-data";

import Episode from "./helpers/Episode";

const GET_UPNEXT = gql`
  query Upnext {
    upnext {
      id
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

const GET_FAVORITES = gql`
  query Favorites {
    favorites {
      id
    }
  }
`;

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      id: null,
      podcastId: null
    };

    this.handleEpisodeModal = this.handleEpisodeModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id, podcastId) {
    const { isLoggedIn, setPlayingEpisode } = this.props;
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
    // if (
    //   this.props.currentEpisode &&
    //   this.props.currentEpisode.title === episode.title
    // )
    //   return console.log("it's current");
    // this.props.updateCurrentEpisode({
    //   variables: {
    //     episode
    //   }
    // });
    Session.set("isPlayerOpen", true);
  }

  handleEpisodeModal(id, podcastId) {
    this.setState({ isModalOpen: !this.state.isModalOpen, id, podcastId });
  }

  /* const className =
        this.props.queue &&
        isEqual(this.props.queue[0].title, episode.title)
          ? "episode episode--active"
          : "episode"; */

  isPlayingEpisode(id) {
    const { playingEpisode } = this.props;
    if (!playingEpisode) return false;

    return playingEpisode.id === id;
  }

  renderFeed() {
    if (this.props.feed.length === 0) return <div>There is no episodes.</div>;
    return (
      <div className="feed">
        {this.props.feed.map(episode => {
          if (!episode) return;
          return (
            <Episode
              key={episode.id}
              episode={episode}
              handleEpisodeModal={this.handleEpisodeModal}
              handleClick={this.handleClick}
              isPlayingEpisode={this.isPlayingEpisode(episode.id)}
              upnext={this.props.upnext}
              favorites={this.props.favorites}
            />
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderFeed()}

        {this.state.isModalOpen ? (
          <EpisodeModal
            isModalOpen={this.state.isModalOpen}
            handleEpisodeModal={this.handleEpisodeModal}
            podcastId={this.state.podcastId}
            id={this.state.id}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(getCurrentEpisode, {
      props: ({ data: { currentEpisode } }) => ({
        currentEpisode
      })
    }),
    graphql(updateCurrentEpisode, { name: "updateCurrentEpisode" }),
    graphql(SET_PLAYING_EPISODE, { name: "setPlayingEpisode" }),
    graphql(GET_PLAYING_EPISODE, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { playingEpisode } }) => ({
        playingEpisode
      })
    }),
    graphql(GET_UPNEXT, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { upnext } }) => ({
        upnext
      })
    }),
    graphql(GET_FAVORITES, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { favorites } }) => ({
        favorites
      })
    })
  )(Feed)
);
