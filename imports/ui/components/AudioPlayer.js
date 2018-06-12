import React, { Component } from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.player = React.createRef();

    this.state = {
      isReady: false,
      isPlaying: false,
      mounted: false,
      isLoading: true,
      isMuted: false,
      volume: 1,
      duration: 0,
      playedSeconds: 0,
      playbackRate: 1,
      minPlaybackRate: 0.5,
      maxPlaybackRate: 4,
      playbackStep: 0.1
    };
  }

  _lastVolume = 0;

  componentDidMount() {
    const { episode } = this.props;
    this.setState({ mounted: true });
    if (episode) {
      this.player.current.src = episode.mediaUrl;
    }

    this.getSeconds();
  }

  componentWillUnmount() {
    clearTimeout(this.getSecondsTimeout);
  }

  getSeconds = () => {
    const { episode } = this.props;
    if (
      episode &&
      this.player.current &&
      this.state.isReady &&
      this.state.isPlaying
    ) {
      this.setState({
        playedSeconds: Math.floor(this.player.current.currentTime)
      });
    }
    this.getSecondsTimeout = setTimeout(this.getSeconds, 1000);
  };

  componentWillReceiveProps(nextProps) {
    const { episode } = this.props;

    if (!episode || episode.mediaUrl !== nextProps.episode.mediaUrl) {
      this.setState({ isLoading: true, isPlaying: false });
      this.player.current.src = nextProps.episode.mediaUrl;
    }
  }

  onReady() {
    this.setState({ isReady: true, isLoading: false });
    this.onPlay();
  }

  onPlay() {
    this.setState({ isPlaying: true });
    this.player.current.play();
  }

  onPause() {
    this.setState({ isPlaying: false });
    this.player.current.pause();
  }

  handlePlayPause() {
    if (!this.state.isPlaying) {
      this.onPlay();
    } else {
      this.onPause();
    }
  }

  increasePlaybackRate() {
    const { playbackRate, playbackStep, maxPlaybackRate } = this.state;
    //https://stackoverflow.com/questions/10473994/javascript-adding-decimal-numbers-issue#10474055
    const newRate = +(playbackRate + playbackStep).toFixed(1);
    if (newRate <= maxPlaybackRate) {
      this.setPlaybackRate(newRate);
    }
  }

  decreasePlaybackRate() {
    const { playbackRate, playbackStep, minPlaybackRate } = this.state;
    // https://stackoverflow.com/questions/10473994/javascript-adding-decimal-numbers-issue#10474055
    const newRate = +(playbackRate - playbackStep).toFixed(1);
    if (newRate >= minPlaybackRate) {
      this.setPlaybackRate(newRate);
    }
  }

  setDuration() {
    this.setState({ duration: this.player.current.duration });
  }

  setPlaybackRate(playbackRate) {
    this.setState({ playbackRate }, () => {
      this.player.current.playbackRate = this.state.playbackRate;
    });
  }

  setTime(value) {
    this.setState({ playedSeconds: Math.floor(value) }, () => {
      this.player.current.currentTime = this.state.playedSeconds;
    });
  }

  setVolume(volume) {
    const isMuted = volume <= 0;
    if (isMuted !== this.state.isMuted) {
      this.onMute(isMuted);
    } else {
      this._lastVolume = volume !== 0 ? volume : this._lastVolume;
    }
    this.setState({ volume }, () => {
      this.player.current.volume = this.state.volume;
    });
  }

  onMute(isMuted) {
    if (isMuted) {
      this._lastVolume = this.state.volume;
      this.setState({ isMuted: true }, () => {
        this.setVolume(0);
      });
    } else {
      const volume = this._lastVolume > 0 ? this._lastVolume : 0.1;
      this.setState({ isMuted: false }, () => {
        this.setVolume(volume);
      });
    }
  }

  skipTime(amount) {
    const { episode } = this.props;
    const { duration, playedSeconds } = this.state;
    const newTime = +(playedSeconds + amount).toFixed(10);
    if (episode && this.player.current && this.state.isReady) {
      if (newTime <= 0) {
        this.setTime(0);
      } else if (newTime >= duration) {
        //TODO next or stop
        this.setTime(duration);
      } else {
        this.setTime(newTime);
      }
    }
  }

  handleMute() {
    this.onMute(!this.state.isMuted);
  }

  formatSeconds(seconds) {
    //TODO fix 0 seconds text
    return moment.duration(seconds, "seconds").format();
  }

  render() {
    const { episode } = this.props;
    return (
      <div className="player">
        <div className="player__controls-left">
          <div
            onClick={() => this.skipTime(-15)}
            className="player__skip player__skip-back"
          >
            <span className="player__skip-text">15</span>
          </div>
          <div>
            <svg
              className={
                this.state.isPlaying
                  ? "player__play player__play--playing"
                  : "player__play"
              }
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 250 250"
            >
              <g onClick={() => this.handlePlayPause()} id="icon">
                <g id="circle">
                  <circle
                    className="player__play-circle"
                    cx="125"
                    cy="125"
                    r="115"
                    fill="#fff"
                  />
                  <path d="M125,20A105,105,0,1,1,20,125,105.12,105.12,0,0,1,125,20m0-20A125,125,0,1,0,250,125,125,125,0,0,0,125,0Z" />
                </g>
                <g className="play__inner" id="inner">
                  <g className="player__play-bars" id="bars">
                    <g id="left">
                      <rect
                        x="92.5"
                        y="87.5"
                        width="15"
                        height="75"
                        fill="#fff"
                      />
                      <polygon points="117.5 77.5 82.5 77.5 82.5 172.5 117.5 172.5 117.5 77.5 117.5 77.5" />
                    </g>
                    <g id="right">
                      <rect
                        x="142.5"
                        y="87.5"
                        width="15"
                        height="75"
                        fill="#fff"
                      />
                      <polygon points="167.5 77.5 132.5 77.5 132.5 172.5 167.5 172.5 167.5 77.5 167.5 77.5" />
                    </g>
                  </g>
                  <path
                    className="player__play-triangle"
                    id="triangle"
                    d="M183.25,125,95.87,175.45V74.55Z"
                  />
                </g>
              </g>
            </svg>
          </div>
          <div
            onClick={() => this.skipTime(30)}
            className="player__skip player__skip-forward"
          >
            <span className="player__skip-text">30</span>
          </div>
        </div>

        <div className="player__controls-center">
          <div className="player__title">
            <span>{episode ? episode.title : "Select episode to play"}</span>
          </div>
          <div className="player__author">
            <span>
              {episode
                ? `${episode.author} - ${moment(episode.pubDate).format(
                    "MMM D, YYYY"
                  )}`
                : "-"}
            </span>
          </div>
          <div className="player__seek-bar">
            <input
              className="seek-bar__range"
              onChange={e => this.setTime(Number(e.target.value))}
              value={this.state.playedSeconds}
              type="range"
              min="0"
              max={this.state.duration}
              step="1"
            />
            <span className="seek-bar__text seek-bar__text--left">
              {this.state.isReady && !this.state.isLoading
                ? this.formatSeconds(this.state.playedSeconds)
                : "--/--"}
            </span>
            <span className="seek-bar__text seek-bar__text--right">
              {this.state.isReady && !this.state.isLoading
                ? this.formatSeconds(this.state.duration)
                : "--/--"}
            </span>
          </div>
        </div>
        <div className="player__controls-right">
          <div className="player__playback-rate">
            <svg
              className="playback-rate__button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 250 250"
            >
              <g
                onClick={() => this.increasePlaybackRate()}
                id="Layer_1-2"
                data-name="Layer 1"
              >
                <path d="M125,0A125,125,0,1,0,250,125,125,125,0,0,0,125,0Zm75,138H137.5v62.5h-25V138H50V113h62.5V50.5h25V113H200Z" />
              </g>
            </svg>
            <div className="playback-rate__text">
              {this.state.playbackRate}x
            </div>
            <svg
              className="playback-rate__button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 250 250"
            >
              <g
                onClick={() => this.decreasePlaybackRate()}
                id="Layer_1-2"
                data-name="Layer 1"
              >
                <path d="M125,0A125,125,0,1,0,250,125,125,125,0,0,0,125,0Zm75,137H50V112H200Z" />
              </g>
            </svg>
          </div>
          <div
            className={
              this.state.isMuted
                ? "player__volume player__volume--muted"
                : "player__volume"
            }
          >
            <svg
              className="volume__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 555.17 442.85"
            >
              <g onClick={() => this.handleMute()}>
                <g className="volume__megaphone" id="volume">
                  <polygon points="145.86 320.5 0.5 320.5 0.5 121.5 147.1 121.5 323.5 0.95 323.5 441.9 145.86 320.5" />
                  <path d="M323,1.89V441L146.27,320.17,146,320H1V122H147.26l.25-.17L323,1.89M324,0,147,121H0V321H145.7L324,442.85V0Z" />
                </g>
                <g className="volume__cross" id="cross">
                  <polygon points="459 251.41 393.95 316.46 363.54 286.05 428.59 221 363.54 155.95 393.95 125.54 459 190.59 524.05 125.54 554.46 155.95 489.41 221 554.46 286.05 524.05 316.46 459 251.41" />
                  <path d="M394,126.25l64.34,64.34.71.71.71-.71,64.34-64.34,29.7,29.7-64.34,64.34-.71.71.71.71,64.34,64.34-29.7,29.7-64.34-64.34-.71-.71-.71.71L394,315.75l-29.7-29.7,64.34-64.34.71-.71-.71-.71L364.25,156l29.7-29.7m130.1-1.42-65,65.06L394,124.83,362.83,156,427.89,221l-65.06,65.05L394,317.17,459,252.11l65,65.06,31.12-31.12L490.11,221,555.17,156l-31.12-31.12Z" />
                </g>
              </g>
            </svg>
            <div className="volume__slider">
              <input
                onChange={e => this.setVolume(Number(e.target.value))}
                value={this.state.volume}
                type="range"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <audio
          style={{ display: "none" }}
          ref={this.player}
          onLoadedMetadata={() => this.setDuration()}
          onCanPlay={() => this.onReady()}
          onPlay={() => this.onPlay()}
          onPause={() => this.onPause()}
          muted={this.state.isMuted}
          preload="auto"
          controls
        />
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    episode: Session.get("episode")
  };
})(AudioPlayer);

// state = {
//   mounted: false,
//   isPlaying: false,
//   isReady: false,
//   isMuted: false,
//   volume: 1,
//   playbackRate: 1,
//   currentTime: 0.1,
//   duration: 0
// };

// componentDidMount() {
//   this.setState({ mounted: true });
//   this.loadSrc(this.props.episode.mediaUrl);
// }

// componentWillReceiveProps(nextProps) {
//   const { mediaUrl } = this.props.episode;

//   if (mediaUrl !== nextProps.episode.mediaUrl) {
//     this.setState({ isPlaying: !this.state.isPlaying });
//   }
// }

//   loadSrc(src) {
//     this.audioEl.src = src;
//   }

//   getDuration() {
//     return this.audioEl.duration;
//   }

//   onPlay() {
//     this.audioEl.play();
//   }

//   onPause() {
//     this.audioEl.pause();
//   }

//   onMute() {
//     const { isMuted } = this.state;
//     this.audioEl.muted = isMuted;
//     this.setState({ isMuted: !isMuted });
//   }

//   onVolumeChange(e) {
//     this.setState({ volume: e.target.value });
//     this.audioEl.volume = this.state.volume;
//   }
//   onPlaybackRateChange(e) {
//     this.setState({ playbackRate: e.target.value });
//     this.audioEl.playbackRate = this.state.playbackRate;
//   }
//   onCurrentTimeChange(e) {
//     this.setState({ currentTime: e.target.value });
//     this.audioEl.currentTime = this.state.currentTime;
//   }

//   onBtnClick() {
//     this.state.isPlaying ? this.onPause() : this.onPlay();
//     this.setState({ isPlaying: !this.state.isPlaying });
//   }
//   onCanPlay() {
//     this.setState({ duration: this.getDuration() });
//     console.log("onCanPlay");
//   }

//   render() {
//     return (
//       <div className="player">
//         <div className="controls-left">
//           <a href="">Logo and link</a>
//           <button>Back 15 seconds</button>
//           <button onClick={() => this.onBtnClick()}>
//             {this.state.isPlaying ? "Pause" : "Play"}
//           </button>
//           <button>Forward 30 seconds</button>
//         </div>

//         <div className="controls-center">
//           <a href="#">
//             {this.props.episode ? this.props.episode.title : "Default title"}
//           </a>
//           <a href="#">Title of podcast. Link to podcast</a>
//           <div>
//             <span>
//               Duration bar instead of audio element {this.state.duration}
//             </span>
//             <input
//               onChange={e => this.onCurrentTimeChange(e)}
//               value={this.state.currentTime}
//               type="range"
//               min="0.1"
//               max={this.state.duration}
//               step="1"
//             />
//           </div>
//           <audio
//             controls
//             onCanPlay={() => this.onCanPlay()}
//             ref={ref => {
//               this.audioEl = ref;
//             }}
//           />
//         </div>
//         <div className="controls-right">
//           <div>
//             <p>Speed control. Current rate is {this.state.playbackRate}</p>
//             <input
//               onChange={e => this.onPlaybackRateChange(e)}
//               value={this.state.playbackRate}
//               type="range"
//               min="0.5"
//               max="4"
//               step="0.1"
//             />
//           </div>
//           <div>
//             <p>Volume control</p>
//             <button onClick={() => this.onMute()}>Mute</button>
//             <input
//               onChange={e => this.onVolumeChange(e)}
//               value={this.state.volume}
//               type="range"
//               min="0"
//               max="1"
//               step="0.05"
//             />
//           </div>
//           <div>Up next list</div>
//         </div>
//       </div>
//     );
//   }
// }
