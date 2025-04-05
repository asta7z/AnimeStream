import React, { useState, useEffect } from 'react';
import AnimeItem from '../components/AnimeItem';
import { fetchPopularAnime } from '../utils/api';

const Popular = () => {
    const [popularAnime, setPopularAnime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);

    const handleViewEpisodes = (animeSlug) => {
        console.log('View episodes for:', animeSlug); // Debugging
        // Add logic to navigate to the episode list or handle the event
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { animeList, hasNextPage } = await fetchPopularAnime(page);
                setPopularAnime((prev) => {
                    const uniqueAnime = animeList.filter(
                        (anime) => !prev.some((existingAnime) => existingAnime.url === anime.url)
                    );
                    return [...prev, ...uniqueAnime];
                });
                setHasNextPage(hasNextPage);
            } catch (error) {
                console.error('Error fetching popular anime:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [page]);

    const loadMore = () => {
        if (hasNextPage) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-white mb-6">Popular Anime</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {popularAnime.map((anime) => (
                    <AnimeItem
                        key={anime.url}
                        anime={anime}
                        onViewEpisodes={handleViewEpisodes} // Pass the function here
                    />
                ))}
            </div>
            {loading && <p className="text-center text-gray-400 mt-6">Loading...</p>}
            {hasNextPage && !loading && (
                <div className="text-center mt-6">
                    <button
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        onClick={loadMore}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default Popular;
