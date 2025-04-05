export const fetchAllAnime = async () => {
    const allAnimes = [];
    let currentPage = 1;
    const pageSize = 50; // Adjust this based on the API's page size
    let hasMorePages = true;

    try {
        while (hasMorePages) {
            const response = await fetch(`https://api.animeiat.co/v1/anime?page=${currentPage}&size=${pageSize}`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const rawData = await response.json();
            const data = rawData.data || [];

            if (data.length > 0) {
                allAnimes.push(
                    ...data.map((anime) => ({
                        title: anime.anime_name,
                        thumbnail: `https://api.animeiat.co/storage/${anime.poster_path}`,
                        url: `/anime/${anime.slug}`,
                        genres: anime.genres || ['Unknown'], // Add genres if available
                    }))
                );
            }

            hasMorePages = data.length === pageSize;
            currentPage++;
        }

        return allAnimes;
    } catch (error) {
        console.error('Error fetching all anime:', error);
        return [];
    }
};

export const fetchEpisodes = async (animeSlug) => {
    try {
        const response = await fetch(`https://api.animeiat.co/v1/anime/${animeSlug}/episodes`);
        if (!response.ok) {
            throw new Error("Failed to fetch episodes: " + response.statusText);
        }

        const rawData = await response.json();
        const episodes = rawData.data.map((episode) => ({
            title: episode.title,
            url: `/anime/${animeSlug}/episode/${episode.slug}`,
            episodeNumber: episode.number,
            thumbnail: `https://api.animeiat.co/storage/${episode.poster_path || 'default-thumbnail.jpg'}`,
        }));

        return episodes;
    } catch (error) {
        console.error("Error fetching episodes:", error);
        return [];
    }
};

export const fetchVideoLinks = async (episodeSlug) => {
    try {
        const response = await fetch(`https://api.animeiat.co/v1/episode/${episodeSlug}`);
        if (!response.ok) {
            throw new Error("Failed to fetch episode page: " + response.statusText);
        }

        const episodePage = await response.text();
        console.log("Episode Page Response:", episodePage); // Debugging

        const playerHashMatch = episodePage.match(/"hash":"(.*?)"/);
        if (!playerHashMatch) {
            throw new Error("Failed to extract player hash");
        }

        const playerHash = playerHashMatch[1];
        console.log("Player Hash:", playerHash); // Debugging

        const playerID = atob(playerHash).split('"').reverse()[1];
        console.log("Player ID:", playerID); // Debugging

        const videoResponse = await fetch(`https://api.animeiat.co/v1/video/${playerID}`);
        if (!videoResponse.ok) {
            throw new Error("Failed to fetch video data: " + videoResponse.statusText);
        }

        const videoData = await videoResponse.json();
        console.log("Video Data:", videoData); // Debugging

        if (videoData && videoData.data) {
            return {
                sources: videoData.data.sources.map((link) => ({
                    url: link.file,
                    label: link.label,
                    quality: link.quality,
                })),
                title: videoData.data.title || "Episode",
                description: videoData.data.description || "No description available.",
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching video links:", error);
        return null;
    }
};

export const fetchPopularAnime = async (page = 1) => {
    try {
        const response = await fetch(`https://api.animeiat.co/v1/anime?page=${page}`);
        if (!response.ok) {
            throw new Error("Failed to fetch popular anime: " + response.statusText);
        }

        const rawData = await response.json();
        const data = rawData.data || [];
        const hasNextPage = rawData.meta.current_page < rawData.meta.last_page;

        const animeList = data.map(anime => ({
            title: anime.anime_name,
            thumbnail: `https://api.animeiat.co/storage/${anime.poster_path}`,
            url: `/anime/${anime.slug}`,
        }));

        return { animeList, hasNextPage };
    } catch (error) {
        console.error("Error fetching popular anime:", error);
        return { animeList: [], hasNextPage: false };
    }
};

export const fetchFilteredAnime = async (page = 1, query = '', type = '', status = '') => {
    try {
        let url = `https://api.animeiat.co/v1/anime?page=${page}`;
        if (query) url += `&q=${query}`; // Add query parameter for search
        if (type) url += `&type=${type}`;
        if (status) url += `&status=${status}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch filtered anime: " + response.statusText);
        }

        const rawData = await response.json();
        const data = rawData.data || [];
        const hasNextPage = rawData.meta.current_page < rawData.meta.last_page;

        const animeList = data.map(anime => ({
            title: anime.anime_name,
            thumbnail: `https://api.animeiat.co/storage/${anime.poster_path}`,
            url: `/anime/${anime.slug}`,
        }));

        return { animeList, hasNextPage };
    } catch (error) {
        console.error("Error fetching filtered anime:", error);
        return { animeList: [], hasNextPage: false };
    }
};

// Add sorting functionality for video quality
export const sortVideosByQuality = (videos, preferredQuality = '1080') => {
    return videos.sort((a, b) => {
        const qualityA = a.quality.includes(preferredQuality) ? 1 : 0;
        const qualityB = b.quality.includes(preferredQuality) ? 1 : 0;
        return qualityB - qualityA;
    });
};
