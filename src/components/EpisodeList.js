import React, { useState, useEffect } from 'react';
import './EpisodeList.css'; // Import the CSS file
import { useParams } from 'react-router-dom';
import { fetchEpisodes } from '../utils/api';
import VideoPlayer from './VideoPlayer';

const EpisodeList = () => {
    const { slug } = useParams();
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchEpisodes(slug);
            setEpisodes(data);
            setLoading(false);
        };
        fetchData();
    }, [slug]);

    const handleWatchEpisode = (episode) => {
        setSelectedEpisode(episode);
    };

    const handleBackToEpisodes = () => {
        setSelectedEpisode(null);
    };

    if (selectedEpisode) {
        return (
            <div>
                <button className="back-button" onClick={handleBackToEpisodes}>
                    <i className="fas fa-arrow-left"></i> Back to Episodes
                </button>
                <VideoPlayer episode={selectedEpisode} />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="episode-list">
                {Array(6).fill(0).map((_, index) => (
                    <div key={index} className="episode-item loading">
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

    if (episodes.length === 0 && !loading) {
        return (
            <div className="no-results">
                <h3>No Episodes Found</h3>
                <p>This anime doesn't have any episodes yet.</p>
            </div>
        );
    }

    return (
        <div className="episode-list">
            {episodes.map((episode) => (
                <div key={episode.url} className="episode-item">
                    <div className="thumbnail">
                        <img src={episode.thumbnail} alt={episode.title} />
                        <span className="episode-number">Ep {episode.episodeNumber}</span>
                    </div>
                    <div className="content">
                        <h3>{episode.title}</h3>
                        <button onClick={() => handleWatchEpisode(episode)}>
                            <i className="fas fa-play"></i> Watch
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EpisodeList;
