import React from "react";
import { Session } from "meteor/session";
import moment from "moment";

const Feed = ({ episodes }) => {
  return (
    <div className="feed">
      {episodes.map(episode => {
        if (!episode) return;
        const unixTime = moment(episode.pubDate).unix();

        return (
          <div key={unixTime} className="episode">
            <div className="episode__title">
              <p>{episode.title}</p>
            </div>
            <div className="episode__pub-date">
              <p>{moment(episode.pubDate).format("MMMM DD")}</p>
            </div>
            <div className="episode__controls">
              <svg
                className="controls__play"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 191 191"
              >
                <g
                  onClick={() => handleClick(episode)}
                  id="Layer_2"
                  data-name="Layer 2"
                >
                  <g id="Layer_1-2" data-name="Layer 1">
                    <circle className="circle" cx="95.5" cy="95.5" r="87.5" />
                    <path d="M95.5,16A79.5,79.5,0,1,1,16,95.5,79.59,79.59,0,0,1,95.5,16m0-16A95.5,95.5,0,1,0,191,95.5,95.5,95.5,0,0,0,95.5,0Z" />
                    <polygon
                      className="icon"
                      points="69.02 58.05 133.75 95.75 68.73 132.96 69.02 58.05"
                    />
                    <path d="M69.14,58.26,133.5,95.75l-64.64,37,.28-74.48m-.25-.43-.28,75.34L134,95.75,68.89,57.83Z" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;

function handleClick(episode) {
  Session.set("isPlayerOpen", true);
  Session.set("episode", episode);
}
