import React, {useCallback, useState} from 'react'
import './SearchBar.css'

const SearchBar = ({onSearch}) => {
  const [term, setTerm] = useState('')
  
  const handleTermChange = useCallback((e) => {
    setTerm(e.target.value)
  }, [])

  const search = useCallback(() => {
    onSearch(term)
  }, [term, onSearch])
  console.log(term)


  return (
    <div className='SearchBar'>
      <input 
        placeholder='Song, Artist or Album'
        onChange={handleTermChange}
      />
      <button className='SearchButton'
        onClick={search}
      >
        Search
      </button>

    </div>
  )
}

export default SearchBar