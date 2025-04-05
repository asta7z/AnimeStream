import React, { useState } from 'react';
import './Header.css'; // Import the CSS file

const Header = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault(); // Prevent page reload
        if (query.trim()) {
            onSearch(query.trim()); // Trigger the search with the trimmed query
        }
    };

    return (
        <header>
            <div className="container">
                <a href="/" className="logo">
                    AnimeStream
                </a>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search anime..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
                <nav>
                    <a href="/">Home</a>
                    <a href="/popular">Popular</a>
                    <a href="#genres">Genres</a>
                    <a href="#about">About</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
