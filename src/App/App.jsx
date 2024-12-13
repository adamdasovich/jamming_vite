import { useCallback, useState, useEffect } from 'react'
import './App.css'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import PlayList from '../PlayList/PlayList'
import Spotify from '../Util/Spotify'
import PlayListsView from '../PlayListsView/PlayListsView'


function App() {

  const [searchResults, setSearchResults] = useState([])
  const [playListName, setPlayListName] = useState('')
  const [playListTracks, setPlayListTracks] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [showPlaylists, setShowPlaylists] = useState(false)

  const search = (term) => {
    Spotify.search(term).then(setSearchResults)
  }

  const playlistsView = () => {
    Spotify.getUserPlaylists().then(fetchedPlaylists => {
      setPlaylists(fetchedPlaylists)
      setShowPlaylists(true)
      console.log(playlists)
    })    
  }

  const backToSearch = () =>
    setShowPlaylists(false)

 
  useEffect(() => {
    console.log(searchResults)  
    console.log(playlists)
  }, [searchResults, playlists])

  const addTrack = useCallback(
    (track) => {
    if (playListTracks.some(savedTrack => savedTrack.id === track.id))
      return;
    setPlayListTracks(prev => [...prev, track])
    }, [playListTracks])

    const removeTrack = useCallback((track) => {
      setPlayListTracks(prev => 
        prev.filter(t => t.id !== track.id)
      )
    }, [])

    const updatePlaylistName = useCallback((name) => {
      setPlayListName(name)
    }, [])
    
    const savePlaylist = useCallback(() => {
      const trackUris = playListTracks.map(track => track.uri)
      Spotify.savePlaylist(playListName, trackUris).then(() => {
        setPlayListName('New playlist')
        setPlayListTracks([])
      })
    }, [playListName, playListTracks])

   
    return (
      <div className='Container'>
        <h1>Jammming</h1>
        <h2>Adam's music</h2>
        <div className='App'>
          <SearchBar 
            onSearch={search}
            onPlaylists={playlistsView}
          />
        </div>
        {showPlaylists ? (
          <PlayListsView playlists={playlists} onBack={backToSearch} />
        ) : (
          <div className='App-playlist'>
            <SearchResults
              searchResults={searchResults}
              addOn={addTrack}       
            />
            <PlayList
              playListName={playListName}
              playListTracks={playListTracks}          
              onRemove={removeTrack}
              onNameChange={updatePlaylistName}
              onSave={savePlaylist}
            />
          </div>
        )}
      </div>
    )
}

export default App
