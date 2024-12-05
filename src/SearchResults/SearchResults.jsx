import React from 'react'
import TrackList from '../TrackList/TrackList'
import './SearchResults.css'

const SearchResults = ({searchResults, addOn}) => {
  return (
    <div className='SearchResults'>
      <h2>Results</h2>
      <TrackList
        tracks={searchResults}
        addOn={addOn}
        isRemoval={false}
      />
    </div>
  )
}

export default SearchResults