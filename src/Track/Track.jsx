import React, { useCallback, useState, useEffect } from "react";

import "./Track.css";


let currentlyPlayingAudio = null;
let currentlyPlayingTrack = null;  // Track the currently playing track component

const Track = (props) => {
  const { track, onAdd, onRemove, isRemoval } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(track.previewUrl ? new Audio(track.previewUrl) : null);
  const [errorMessage, setErrorMessage] = useState('');

  const addTrack = useCallback(() => {
    onAdd(track);
  }, [onAdd, track]);

  const removeTrack = useCallback(() => {
    onRemove(track);
  }, [onRemove, track]);

  const renderAction = () => {
    if (isRemoval) {
      return (
        <button className="Track-action" onClick={removeTrack}>
          -
        </button>
      );
    }
    return (
      <button className="Track-action" onClick={addTrack}>
        +
      </button>
    );
  };

  const playPreview = () => {
    try {
      if (!audio) {
        setErrorMessage('This track does not have a preview.');
        return;
      }

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
          currentlyPlayingAudio.pause();
          currentlyPlayingTrack?.setIsPlaying(false);  // Reset the previous track's state
        }
        audio.play().catch((error) => {
          setErrorMessage('Ups! This element has no supported sources.');
        });
        currentlyPlayingAudio = audio;
        currentlyPlayingTrack = { setIsPlaying };
        setIsPlaying(true);
      }
    } catch (error) {
      setErrorMessage('Ups! This element has no supported sources.');
    }
  };

  const showInfo = () => {
    setErrorMessage('No preview available for this track.');
  };

  useEffect(() => {
    if (audio) {
      audio.addEventListener('ended', () => setIsPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setIsPlaying(false));
        audio.pause();
      };
    }
  }, [audio]);

  const closeErrorMessage = () => {
    setErrorMessage('');
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`Track ${isPlaying ? 'Track-playing' : ''}`}>
      <img src={track.imageUrl} alt={`${track.name} album cover`} className="Track-image" />
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>
          {track.artist} | {track.album}
        </p>
      </div>
      {track.previewUrl ? (
        <button className="Track-preview" onClick={playPreview}>
          {isPlaying ? '||' : '▶'}
        </button>
      ) : (
        <button className="InfoButton" onClick={showInfo}>
          ℹ
        </button>
      )}
      {renderAction()}

      {errorMessage && (
        <div className="ErrorMessage">
          <p className='ErrorP'>{errorMessage}</p>
          <button className='ErrorButton' onClick={closeErrorMessage}>Close</button>
        </div>
      )}
    </div>
  );
};



export default Track;
