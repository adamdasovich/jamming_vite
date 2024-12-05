import React, { useCallback } from 'react'
import TrackList from '../TrackList/TrackList'
import './PlayList.css'

const PlayList = ({playListTracks, removeOn, onNameChange, currentTrackId, onSave}) => {
  const handleNameChange = useCallback((e) => {
    onNameChange(e.target.value)
  }, [onNameChange])


  return (
    <div className='Playlist'>
      <input 
        onChange={handleNameChange}
        placeholder='Create a Playlist...'
        name='playlist' 
      />
      <TrackList 
        tracks={playListTracks}
        removeOn={removeOn}
        isRemoval={true}
        currentTrackId={currentTrackId}
      />
      <button 
        className='Playlist-save'
        onClick={onSave} 
      >
        Save to Spotify
      </button>

    </div>
  )
}

export default PlayList