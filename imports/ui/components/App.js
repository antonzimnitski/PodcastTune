import React, { Component } from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import SideBar from "./SideBar";
import Podcasts from "./Podcasts";
import PodcastPage from "./PodcastPage";
import Discover from "./Discover";
import DiscoverByGenre from "./DiscoverByGenre";
import AudioPlayer from "./AudioPlayer";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="page-content">
          <div className="page-content__sidebar">
            <SideBar />
          </div>
          <div className="page-content__main">
            <div className="main">
              <Switch>
                <Route
                  path="/"
                  exact
                  component={() => <Podcasts title="Podcasts" />}
                />
                <Route path="/podcasts/:podcastId" component={PodcastPage} />
                <Route
                  path="/discover"
                  exact
                  component={() => <Discover title="Discover" />}
                />
                <Route path="/discover/:genreId" component={DiscoverByGenre} />
                <Redirect to="/" />
              </Switch>
            </div>
          </div>
          {this.props.isPlayerOpen ? <AudioPlayer /> : null}
        </div>
      </BrowserRouter>
    );
  }
}

export default withTracker(() => {
  return {
    isPlayerOpen: Session.get("isPlayerOpen")
  };
})(App);
