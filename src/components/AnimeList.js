import React, { useState, useEffect } from 'react';
import './AnimeList.css'; // Import the CSS file
import AnimeItem from './AnimeItem';
import EpisodeList from './EpisodeList';
import { fetchPopularAnime, fetchFilteredAnime } from '../utils/api';

const AnimeList = ({ animeList, loading }) => {
    const [selectedAnimeSlug, setSelectedAnimeSlug] = useState(null);
    const [popularAnime, setPopularAnime] = useState([]);
    const [loadingPopular, setLoadingPopular] = useState(true);
    const [filters, setFilters] = useState({ type: '', status: '' });

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
    };

    useEffect(() => {
        const fetchData = async () => {
            const { animeList } = await fetchPopularAnime();
            setPopularAnime(animeList);
            setLoadingPopular(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const { animeList } = await fetchFilteredAnime(1, '', filters.type, filters.status);
            setPopularAnime(animeList);
            setLoadingPopular(false);
        };
        fetchData();
    }, [filters]);

    const handleViewEpisodes = (animeSlug) => {
        setSelectedAnimeSlug(animeSlug);
    };

    const handleBackToAnimeList = () => {
        setSelectedAnimeSlug(null);
    };

    if (selectedAnimeSlug) {
        return (
            <div>
                <button className="back-button" onClick={handleBackToAnimeList}>
                    <i className="fas fa-arrow-left"></i> Back to Anime List
                </button>
                <EpisodeList animeSlug={selectedAnimeSlug} />
            </div>
        );
    }

    if (loading || loadingPopular) {
        return (
            <div className="anime-list">
                {Array(10).fill(0).map((_, index) => (
                    <div key={index} className="anime-item loading">
                        <div className="thumbnail"></div>
                        <div className="content">
                            <div className="title-placeholder"></div>
                            <div className="subtitle-placeholder"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (popularAnime.length === 0) {
        return (
            <div className="no-results">
                <h3>No Anime Found</h3>
                <p>Try searching for a different title or check your internet connection.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="filters">
                <select onChange={(e) => handleFilterChange('type', e.target.value)}>
                    <option value="">All Types</option>
                    <option value="movie">Movie</option>
                    <option value="ova">OVA</option>
                    <option value="ona">ONA</option>
                    <option value="special">Special</option>
                </select>
                <select onChange={(e) => handleFilterChange('status', e.target.value)}>
                    <option value="">All Status</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                </select>
            </div>
            <div className="anime-list">
                {animeList.map((anime) => (
                    <AnimeItem
                        key={anime.url}
                        anime={anime}
                        onViewEpisodes={handleViewEpisodes} // Pass the function here
                    />
                ))}
            </div>
        </div>
    );
};

export default AnimeList;
