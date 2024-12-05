import { useCallback, useState, useEffect } from 'react'
import './App.css'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import PlayList from '../PlayList/PlayList'
import Spotify from '../Util/Spotify'


function App() {

  const [searchResults, setSearchResults] = useState([])
  const [playListName, setPlayListName] = useState('Adams')
  const [playListTracks, setPlayListTracks] = useState([])

  const search = useCallback((term) => {
    Spotify.search(term).then(setSearchResults)
  }, [])

  useEffect(() => {
    console.log(searchResults)
  }, [searchResults])

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
        />
      </div>
      <div className='App-playlist'>
        <SearchResults
          searchResults={searchResults}
          addOn={addTrack}       
        />
        <PlayList
          playListName={playListName}
          playListTracks={playListTracks}          
          removeOn={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  )
}

export default App
