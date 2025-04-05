import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AnimeList from './components/AnimeList';
import EpisodeList from './components/EpisodeList';
import Footer from './components/Footer';
import { fetchAllAnime, fetchFilteredAnime } from './utils/api'; // Import fetchFilteredAnime
import Popular from './pages/Popular'; // Import the Popular page

const App = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query) => {
        setLoading(true);
        try {
            const { animeList } = await fetchFilteredAnime(1, query); // Fetch search results from the API
            setAnimeList(animeList); // Update the anime list with the API results
        } catch (error) {
            console.error('Error during search:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Router>
            <div className="app-container">
                <Header onSearch={handleSearch} />
                <main className="main-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <HeroSection />
                                    <div className="content-container">
                                        {loading ? (
                                            <div className="loading-container">
                                                <div className="spinner"></div>
                                                <p>Loading...</p>
                                            </div>
                                        ) : animeList.length > 0 ? (
                                            <AnimeList animeList={animeList} loading={loading} />
                                        ) : (
                                            <div className="no-results">
                                                <h3>No Anime Found</h3>
                                                <p>Try searching for a different title or check your internet connection.</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            }
                        />
                        <Route path="/popular" element={<Popular />} />
                        <Route path="/anime/:slug" element={<EpisodeList />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
