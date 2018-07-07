import React from "react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

const Episode = ({ episode, handleEpisodeModal, handleClick }) => {
  return (
    <div className="episode">
      {episode.podcastArtworkUrl ? (
        <div
          className="episode__artwork"
          style={{
            backgroundImage: `url("${episode.podcastArtworkUrl}")`
          }}
        />
      ) : null}
      <div
        className="episode__info"
        onClick={() => handleEpisodeModal(episode.id, episode.podcastId)}
      >
        <p className="episode__title">{episode.title}</p>
        {episode.author ? (
          <p className="episode__author">{episode.author}</p>
        ) : null}
      </div>
      <div className="episode__pub-date">
        <p>{formatDate(episode.pubDate)}</p>
      </div>
      <div className="episode__duration">
        <p>{formatDuration(episode.duration)}</p>
      </div>
      <div className="episode__controls">
        <svg
          className="controls__play"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 250 250"
        >
          <g
            onClick={() => handleClick(episode.id, episode.podcastId)}
            id="icon"
          >
            <g id="circle">
              <circle
                className="play__circle"
                cx="125"
                cy="125"
                r="115"
                fill="#fff"
              />
              <path d="M125,20A105,105,0,1,1,20,125,105.12,105.12,0,0,1,125,20m0-20A125,125,0,1,0,250,125,125,125,0,0,0,125,0Z" />
            </g>
            <g className="play__inner" id="inner">
              <g className="play__bars" id="bars">
                <g id="left">
                  <rect x="92.5" y="87.5" width="15" height="75" fill="#fff" />
                  <polygon points="117.5 77.5 82.5 77.5 82.5 172.5 117.5 172.5 117.5 77.5 117.5 77.5" />
                </g>
                <g id="right">
                  <rect x="142.5" y="87.5" width="15" height="75" fill="#fff" />
                  <polygon points="167.5 77.5 132.5 77.5 132.5 172.5 167.5 172.5 167.5 77.5 167.5 77.5" />
                </g>
              </g>
              <path
                className="play__triangle"
                id="triangle"
                d="M183.25,125,95.87,175.45V74.55Z"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

function formatDate(date) {
  if (moment(date).isValid()) {
    const format =
      moment(date).year() === moment().year() ? "MMM D" : "MMM D, YYYY";
    return moment(date).format(format);
  }
  return "";
}

function formatDuration(seconds) {
  if (!seconds) return "";
  return moment.duration(seconds, "seconds").format();
}

export default Episode;
