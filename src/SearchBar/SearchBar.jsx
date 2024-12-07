import React, {useCallback, useState} from 'react'
import './SearchBar.css'

const SearchBar = ({onSearch, onPlaylists}) => {
  const [term, setTerm] = useState('')
  
  const handleTermChange = useCallback((e) => {
    setTerm(e.target.value)
  }, [])

  const search = useCallback(() => {
    onSearch(term)
    localStorage.setItem('spotifySearchTerm', term)
  }, [term, onSearch])
  console.log(term)

  const playlists = useCallback(() => {
    onPlaylists()
  }, [])

  console.log(playlists)


  return (
    <div className='SearchBar'>
    <div className='input-term'>
      <input 
        placeholder='Song, Artist or Album'
        onChange={handleTermChange}
      />
    </div>
    <div className='search-button'>
      <button className='SearchButton'
        onClick={search}
      >
        Search
      </button>
    </div>
    <br />
    <div className='playlist-button'>
      <button className='SearchButton'
        onClick={playlists}
      >
        Your Playlists
      </button>
    </div>
    </div>
  )
}

export default SearchBar