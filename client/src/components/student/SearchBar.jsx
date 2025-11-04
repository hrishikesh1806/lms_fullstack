import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

// Accept the className prop passed from the parent component (Hero)
const SearchBar = ({ data, className }) => {

    const navigate = useNavigate()

    const [input, setInput] = useState(data ? data : '')

    const onSearchHandler = (e) => {
        e.preventDefault()

        navigate('/course-list/' + input)

    }

    return (
        <form 
            onSubmit={onSearchHandler} 
            // Applying a default white transparent background (bg-white/10) and white border for visibility.
            className={`max-w-xl w-full md:h-14 h-12 flex items-center rounded-full overflow-hidden relative z-20 
                        bg-white/10 border border-white/20 backdrop-blur-sm ${className}`}
        >
            
            {/* Search Icon: Invert filter makes it white for dark background */}
            <img 
                className="md:w-auto w-10 px-3 filter invert opacity-80" 
                src={assets.search_icon} 
                alt="search_icon" 
            />

            {/* Input Field: bg-transparent makes it see-through */}
            <input
                onChange={e => setInput(e.target.value)}
                value={input}
                type="text"
                id="search"
                className="w-full h-full outline-none bg-transparent text-white placeholder-white/80"
                placeholder="Search for projects"
            />
            
            {/* Search Button: Updated to orange accent color */}
            <button 
                type='submit' 
                className="bg-orange-500 hover:bg-orange-600 transition duration-300 text-white font-semibold h-full px-8 py-3 flex-shrink-0"
            >
                Search
            </button>
        </form>
    )
}

export default SearchBar
