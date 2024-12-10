import React from 'react'
import './PlayListsView.css'

const PlayListsView = ({playlists, onBack}) => {
  console.log(playlists)
  return (
    <div className='PlayListsView'>
      <h2>Your Playlists</h2>
      <button
        className='PlayListsView-onBack' 
        onClick={onBack}
      >Back to Search
      </button>
      <ul className='user-playlists'>
        {playlists.map(playlist => (
          <li key={playlist.id}>{playlist.name} - {playlist.trackCount} tracks</li>
        )

        )}
      </ul>
        
    </div>
  )
}

export default PlayListsView