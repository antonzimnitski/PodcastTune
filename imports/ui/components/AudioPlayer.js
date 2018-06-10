import React, { Component } from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";

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
      console.log(this.player.current.currentTime);
    }
    this.getSecondsTimeout = setTimeout(this.getSeconds, 2000);
  };

  componentWillReceiveProps(nextProps) {
    const { episode } = this.props;

    if (!episode || episode.mediaUrl !== nextProps.episode.mediaUrl) {
      this.setState({ isLoading: true });
      this.setState({ isPlaying: false });
      this.player.current.src = nextProps.episode.mediaUrl;
    }
  }

  onReady() {
    this.setState({ isReady: true });
    this.setState({ isLoading: false });
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
    this.setState({ playbackRate });
    this.player.current.playbackRate = this.state.playbackRate;
  }

  onTimeChange(e) {
    this.setState({ playedSeconds: e.target.value });
    this.player.current.currentTime = this.state.playedSeconds;
  }

  onVolumeChange(e) {
    this.setState({ volume: Number(e.target.value) });
    console.log(this.state.volume);
    this.player.current.volume = this.state.volume;
  }

  onMute() {
    if (this.state.isMuted) {
      this.setState({ isMuted: false });
    } else {
      this.setState({ isMuted: true });
    }

    this.player.current.muted = !this.state.isMuted;
  }

  render() {
    const { episode } = this.props;
    return (
      <div className="player">
        <p>CurrentTime {this.state.playedSeconds}</p>
        <p>{episode ? episode.title : "Select episode to play"}</p>
        <p>{episode ? episode.author : "-"}</p>
        <p>
          Duration
          {this.state.isReady && !this.state.isLoading
            ? this.state.duration
            : "--/--"}
        </p>
        <button onClick={() => this.handlePlayPause()}>
          {this.state.isPlaying ? "Pause" : "Play"}
        </button>

        <div>
          <span>
            Duration bar instead of audio element {this.state.duration}
          </span>
          <input
            onChange={e => this.onTimeChange(e)}
            value={this.state.playedSeconds}
            type="range"
            min="0"
            max={this.state.duration}
            step="1"
          />
        </div>

        <div>
          <button onClick={() => this.decreasePlaybackRate()}>-</button>
          <p>Current rate is {this.state.playbackRate}</p>
          <button onClick={() => this.increasePlaybackRate()}>+</button>
        </div>

        <div />
        <div>
          <p>Volume control</p>
          <button onClick={() => this.onMute()}>
            {this.state.isMuted ? "Unmute" : "Mute"}
          </button>
          <input
            onChange={e => this.onVolumeChange(e)}
            value={this.state.volume}
            type="range"
            min="0"
            max="1"
            step="0.05"
          />
        </div>

        <audio
          style={{ display: "none" }}
          ref={this.player}
          onLoadedMetadata={() => this.setDuration()}
          onCanPlay={() => this.onReady()}
          onPlay={() => this.onPlay()}
          onPause={() => this.onPause()}
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
