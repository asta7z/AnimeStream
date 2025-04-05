import React from 'react';
import { Link } from 'react-router-dom';

const AnimeItem = ({ anime, onViewEpisodes }) => {
    const genres = anime.genres || ['Unknown']; // Provide a default value for genres

    return (
        <div className="anime-item">
            <img
                src={anime.thumbnail}
                alt={anime.title}
            />
            <div className="content">
                <h3>{anime.title}</h3>
                <p>{genres.join(', ')}</p>
                <button onClick={() => onViewEpisodes(anime.url)}> {/* Use the function here */}
                    <i className="fas fa-list"></i> View Episodes
                </button>
            </div>
        </div>
    );
};

export default AnimeItem;
