import React, { Component } from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Header from "./Header";
import SideBar from "./SideBar";
import Podcasts from "./Podcasts";
import PodcastPage from "./PodcastPage";
import Discover from "./Discover";
import DiscoverByGenre from "./DiscoverByGenre";
import AudioPlayer from "./AudioPlayer";
import InProgress from "./InProgress";
import Favorites from "./Favorites";
import NewReleases from "./NewReleases";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="page-content">
          <Header />
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
                <Route
                  path="/in-progress"
                  exact
                  component={() => <InProgress title="In Progress" />}
                />
                <Route
                  path="/favorites"
                  exact
                  component={() => <Favorites title="Favorites episodes" />}
                />
                <Route
                  path="/new-releases"
                  exact
                  component={() => <NewReleases title="New Releases" />}
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
          <div
            onClick={() => this.props.handleNavToggle()}
            className="top-header__overlay"
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default withTracker(() => {
  return {
    isPlayerOpen: Session.get("isPlayerOpen"),
    handleNavToggle: () => Session.set("isNavOpen", !Session.get("isNavOpen"))
  };
})(App);
