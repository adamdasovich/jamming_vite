import React from 'react'

const PlayListsView = ({playlists, onBack}) => {
  console.log(playlists)
  return (
    <div className='PlayListsView'>
      <h2>Your Playlists</h2>
      <button onClick={onBack}>Back to Search</button>
      <ul>
        {playlists.map(playlist => (
          <li key={playlist.id}>{playlist.name} - {playlist.trackCount} tracks</li>
        )

        )}
      </ul>
        
    </div>
  )
}

export default PlayListsView