import React from "react";

const UpNextPopup = ({ queue, onQueueItemClick }) => {
  if (!queue || queue.length === 1) {
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
      <div className="up-next__queue">
        {queue.map((episode, index) => {
          if (index < 1) return;
          return (
            <div
              key={episode.id}
              className="queue__item"
              onClick={() => onQueueItemClick(index)}
            >
              <svg
                className="queue__play-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 250 250"
              >
                <path d="M125,0A125,125,0,1,0,250,125,125,125,0,0,0,125,0ZM85.67,192.79V56.54l118,68.13Z" />
              </svg>
              <div className="queue__info">
                <div className="queue__title">{episode.title}</div>
                <div className="queue__author">{episode.author}</div>
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default UpNextPopup;
