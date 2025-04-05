// Fetching all anime data
const fetchAllAnime = async () => {
    const allAnimes = [];
    let currentPage = 1;
    const pageSize = 50;  // Adjust this based on how many results you want per page
    let hasMorePages = true;

    try {
        while (hasMorePages) {
            const response = await fetch(`https://api.animeiat.co/v1/anime?page=${currentPage}&size=${pageSize}`);
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }

            const rawData = await response.json();
            const data = rawData.data || [];

            if (data.length > 0) {
                allAnimes.push(...data.map(anime => ({
                    title: anime.anime_name,
                    thumbnail: `https://api.animeiat.co/storage/${anime.poster_path}`,
                    url: `/anime/${anime.slug}`,
                    rating: (Math.random() * (5 - 4) + 4).toFixed(1),
                    episodeCount: Math.floor(Math.random() * 24) + 1,
                    genres: getRandomGenres()
                })));
            }

            hasMorePages = data.length === pageSize; // If we received less than a page, there are no more pages
            currentPage++;
        }

        return allAnimes;
    } catch (error) {
        console.error("Error fetching all anime:", error);
        return [];
    }
};

// Helper function to get random genres
const getRandomGenres = () => {
    const allGenres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Supernatural"];
    const count = Math.floor(Math.random() * 2) + 1;
    const selected = [];
    
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * allGenres.length);
        if (!selected.includes(allGenres[randomIndex])) {
            selected.push(allGenres[randomIndex]);
        }
    }
    
    return selected;
};

// Fetching episodes for a given anime
const fetchEpisodes = async (animeSlug) => {
    try {
        const response = await fetch(`https://api.animeiat.co/v1/anime/${animeSlug}/episodes`);
        const data = await response.json();

        if (data && data.data) {
            return data.data.map(episode => ({
                title: episode.title,
                url: `/anime/${animeSlug}/episode/${episode.slug}`,
                episodeNumber: episode.number,
                thumbnail: `https://api.animeiat.co/storage/${episode.poster_path || 'default-thumbnail.jpg'}`,
                duration: `${Math.floor(Math.random() * 5) + 20}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                releaseDate: getRandomReleaseDate()
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching episodes:", error);
        return [];
    }
};

// Helper function to get random release date
const getRandomReleaseDate = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[Math.floor(Math.random() * months.length)];
    const day = Math.floor(Math.random() * 28) + 1;
    return `${month} ${day}, 2025`;
};

// Fetching video links for an episode
// Removed duplicate declaration of fetchVideoLinks

// Fetch popular anime
const fetchPopularAnime = async (page = 1) => {
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

// (Duplicate fetchEpisodes function removed)

// Fetch video links for an episode
const fetchVideoLinks = async (episodeSlug) => {
    try {
        const response = await fetch(`https://api.animeiat.co/v1/episode/${episodeSlug}`);
        if (!response.ok) {
            throw new Error("Failed to fetch episode page: " + response.statusText);
        }

        const episodePage = await response.text();
        const playerHash = episodePage.match(/"hash":"(.*?)"/)[1];
        const playerID = atob(playerHash).split('"').reverse()[1];

        const videoResponse = await fetch(`https://api.animeiat.co/v1/video/${playerID}`);
        if (!videoResponse.ok) {
            throw new Error("Failed to fetch video data: " + videoResponse.statusText);
        }

        const videoData = await videoResponse.json();
        return videoData.data.sources.map(source => ({
            url: source.file,
            label: source.label,
            quality: source.quality,
        }));
    } catch (error) {
        console.error("Error fetching video links:", error);
        return [];
    }
};

// Rendering anime list dynamically with enhanced UI
const renderAnimeList = async () => {
    const animeListContainer = document.getElementById("anime-list");

    // Show loading state
    animeListContainer.innerHTML = Array(10).fill(0).map(() => `
        <div class="animate-pulse">
            <div class="bg-gray-700 h-64 rounded-t-lg"></div>
            <div class="p-4 bg-gray-800 rounded-b-lg">
                <div class="h-6 bg-gray-700 rounded mb-3"></div>
                <div class="h-4 bg-gray-700 rounded mb-3 w-3/4"></div>
                <div class="h-8 bg-gray-700 rounded"></div>
            </div>
        </div>
    `).join('');

    // Fetch all anime data
    const allAnimes = await fetchAllAnime();

    if (allAnimes.length > 0) {
        setTimeout(() => { // Adding a slight delay to show the loading animation
            animeListContainer.innerHTML = allAnimes.map(anime => `
                <div class="anime-item rounded-lg overflow-hidden shadow-lg group relative">
                    <div class="relative">
                        <img src="${anime.thumbnail}" alt="${anime.title}" 
                            class="w-full h-64 object-cover rounded-t-lg group-hover:opacity-80 transition-all duration-300"
                            onerror="this.onerror=null; this.src='/api/placeholder/320/480';">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <button class="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transform scale-90 group-hover:scale-100 transition-all duration-300">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 p-3">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-300"><i class="fas fa-star text-yellow-500 mr-1"></i> ${anime.rating}</span>
                                <span class="text-sm text-gray-300">Ep ${anime.episodeCount}</span>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 bg-gray-800 rounded-b-lg">
                        <h3 class="text-xl font-semibold text-white truncate">${anime.title}</h3>
                        <p class="text-gray-400 text-sm mb-3">${anime.genres.join(', ')}</p>
                        <button class="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-300 flex items-center justify-center"
                                onclick="loadEpisodes('${anime.url}')">
                            <i class="fas fa-list mr-2"></i> View Episodes
                        </button>
                    </div>
                </div>
            `).join('');
        }, 1000);
    } else {
        animeListContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-5xl text-gray-700 mb-4"><i class="fas fa-search"></i></div>
                <h3 class="text-2xl font-bold text-white mb-2">No Anime Found</h3>
                <p class="text-gray-400">Try adjusting your search or filters</p>
            </div>
        `;
    }
};

// Loading episodes with improved UI
const loadEpisodes = async (animeUrl) => {
    const animeSlug = animeUrl.split("/").pop(); // Extract the slug from the URL
    const animeListContainer = document.getElementById("anime-list");
    
    // Show loading state
    animeListContainer.innerHTML = `
        <div class="col-span-full">
            <div class="flex items-center mb-6">
                <button class="mr-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
                        onclick="renderAnimeList()">
                    <i class="fas fa-arrow-left mr-2"></i> Back
                </button>
                <h2 class="text-2xl font-bold text-white">Loading Episodes...</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${Array(6).fill(0).map(() => `
                    <div class="animate-pulse flex bg-gray-800 p-4 rounded-lg">
                        <div class="bg-gray-700 h-24 w-40 rounded mr-4"></div>
                        <div class="flex-1">
                            <div class="h-6 bg-gray-700 rounded mb-3"></div>
                            <div class="h-4 bg-gray-700 rounded mb-3 w-3/4"></div>
                            <div class="h-8 bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    const episodes = await fetchEpisodes(animeSlug);
    
    if (episodes.length > 0) {
        setTimeout(() => {
            animeListContainer.innerHTML = `
                <div class="col-span-full">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center">
                            <button class="mr-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
                                    onclick="renderAnimeList()">
                                <i class="fas fa-arrow-left mr-2"></i> Back
                            </button>
                            <h2 class="text-2xl font-bold text-white">Episodes</h2>
                        </div>
                        <div class="flex items-center">
                            <select class="bg-gray-800 text-gray-300 rounded py-1 px-3 border border-gray-700 mr-2">
                                <option>All Seasons</option>
                                <option>Season 1</option>
                                <option>Season 2</option>
                            </select>
                            <button class="px-3 py-1 bg-gray-800 text-white rounded border border-gray-700">
                                <i class="fas fa-sort-amount-down mr-1"></i> Sort
                            </button>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${episodes.map(episode => `
                            <div class="flex bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300">
                                <div class="relative w-40 flex-shrink-0">
                                    <img src="${episode.thumbnail}" alt="${episode.title}" class="h-full w-full object-cover"
                                        onerror="this.onerror=null; this.src='/api/placeholder/160/90';">
                                    <div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <button class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                                onclick="loadVideo('${episode.url}')">
                                            <i class="fas fa-play"></i>
                                        </button>
                                    </div>
                                    <span class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">${episode.duration}</span>
                                </div>
                                <div class="p-4 flex-1">
                                    <div class="flex justify-between">
                                        <span class="text-sm font-medium text-gray-400">Episode ${episode.episodeNumber}</span>
                                        <span class="text-xs text-gray-500">${episode.releaseDate}</span>
                                    </div>
                                    <h3 class="text-white font-medium mt-1 mb-2 truncate">${episode.title}</h3>
                                    <button class="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors duration-300 flex items-center w-auto"
                                            onclick="loadVideo('${episode.url}')">
                                        <i class="fas fa-play mr-2"></i> Watch
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }, 800);
    } else {
        animeListContainer.innerHTML = `
            <div class="col-span-full">
                <div class="flex items-center mb-6">
                    <button class="mr-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
                            onclick="renderAnimeList()">
                        <i class="fas fa-arrow-left mr-2"></i> Back
                    </button>
                    <h2 class="text-2xl font-bold text-white">Episodes</h2>
                </div>
                
                <div class="text-center py-12 bg-gray-800 rounded-lg">
                    <div class="text-5xl text-gray-700 mb-4"><i class="fas fa-film"></i></div>
                    <h3 class="text-2xl font-bold text-white mb-2">No Episodes Found</h3>
                    <p class="text-gray-400 mb-4">This anime doesn't have any episodes yet.</p>
                    <button class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                            onclick="renderAnimeList()">Back to Anime</button>
                </div>
            </div>
        `;
    }
};

// Loading video with enhanced UI
const loadVideo = async (episodeUrl) => {
    const episodeSlug = episodeUrl.split("/").pop(); // Extract the slug from the URL
    const videoContainer = document.getElementById("video-container");
    
    // Show loading state
    videoContainer.innerHTML = `
        <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div class="relative pt-[56.25%] bg-gray-800 flex items-center justify-center">
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
                </div>
            </div>
            <div class="p-6">
                <div class="animate-pulse">
                    <div class="h-8 bg-gray-800 rounded mb-3 w-1/2"></div>
                    <div class="h-4 bg-gray-800 rounded mb-6 w-1/4"></div>
                    <div class="h-4 bg-gray-800 rounded mb-2 w-full"></div>
                    <div class="h-4 bg-gray-800 rounded mb-6 w-3/4"></div>
                    <div class="flex gap-3">
                        <div class="h-10 bg-gray-800 rounded w-32"></div>
                        <div class="h-10 bg-gray-800 rounded w-32"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    videoContainer.style.display = "block";
    
    // Scroll to video container
    videoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    const videoData = await fetchVideoLinks(episodeSlug);
    
    if (videoData && videoData.sources && videoData.sources.length > 0) {
        setTimeout(() => {
            videoContainer.innerHTML = `
                <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                    <div class="relative pt-[56.25%]">
                        <video id="video-player" controls class="absolute inset-0 w-full h-full" autoplay>
                            <source src="${videoData.sources[0].url}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        
                        <!-- Video quality selector -->
                        <div class="absolute bottom-16 right-4 bg-black/80 rounded p-2 text-white hidden" id="quality-menu">
                            <div class="mb-2 text-sm font-medium">Quality</div>
                            ${videoData.sources.map(source => `
                                <button class="block w-full text-left py-1 px-2 hover:bg-gray-700 text-sm rounded"
                                        onclick="changeQuality('${source.url}')">
                                    ${source.label || source.quality}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-2xl font-bold text-white mb-1">${videoData.title}</h3>
                                <p class="text-gray-400">Season ${videoData.season} • Episode ${videoData.episodeNumber}</p>
                            </div>
                            <div class="flex items-center gap-4">
                                <button class="flex items-center text-gray-400 hover:text-white" id="quality-btn"
                                        onclick="document.getElementById('quality-menu').classList.toggle('hidden')">
                                    <i class="fas fa-cog mr-2"></i> Quality
                                </button>
                                <button class="flex items-center text-gray-400 hover:text-white">
                                    <i class="far fa-heart mr-2"></i> Favorite
                                </button>
                                <button class="flex items-center text-gray-400 hover:text-white">
                                    <i class="fas fa-share-alt mr-2"></i> Share
                                </button>
                            </div>
                        </div>
                        
                        <p class="text-gray-300 mb-6">${videoData.description}</p>
                        
                        <div class="flex gap-3">
                            <button class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md flex items-center">
                                <i class="fas fa-step-backward mr-2"></i> Previous
                            </button>
                            <button class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center">
                                <i class="fas fa-step-forward mr-2"></i> Next Episode
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }, 1500);
    } else {
        setTimeout(() => {
            videoContainer.innerHTML = `
                <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden p-8 text-center">
                    <div class="text-5xl text-gray-700 mb-4"><i class="fas fa-exclamation-circle"></i></div>
                    <h3 class="text-2xl font-bold text-white mb-2">Video Unavailable</h3>
                    <p class="text-gray-400 mb-6">Sorry, this video is currently unavailable. Please try again later.</p>
                    <button class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                            onclick="document.getElementById('video-container').style.display = 'none';">
                        Close
                    </button>
                </div>
            `;
        }, 1000);
    }
};

// Change video quality
const changeQuality = (videoUrl) => {
    const videoPlayer = document.getElementById("video-player");
    const currentTime = videoPlayer.currentTime;
    
    // Update source and preserve playback position
    videoPlayer.querySelector("source").src = videoUrl;
    videoPlayer.load();
    videoPlayer.currentTime = currentTime;
    videoPlayer.play();
    
    // Hide quality menu
    document.getElementById("quality-menu").classList.add("hidden");
};

// Add search functionality
const searchAnime = async (query) => {
    const animeListContainer = document.getElementById("anime-list");

    // Show loading state
    animeListContainer.innerHTML = Array(10).fill(0).map(() => `
        <div class="animate-pulse">
            <div class="bg-gray-700 h-64 rounded-t-lg"></div>
            <div class="p-4 bg-gray-800 rounded-b-lg">
                <div class="h-6 bg-gray-700 rounded mb-3"></div>
                <div class="h-4 bg-gray-700 rounded mb-3 w-3/4"></div>
                <div class="h-8 bg-gray-700 rounded"></div>
            </div>
        </div>
    `).join('');

    try {
        const response = await fetch(`https://api.animeiat.co/v1/anime?q=${query}`);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }

        const rawData = await response.json();
        const data = rawData.data || [];

        if (data.length > 0) {
            animeListContainer.innerHTML = data.map(anime => `
                <div class="anime-item rounded-lg overflow-hidden shadow-lg group relative">
                    <div class="relative">
                        <img src="https://api.animeiat.co/storage/${anime.poster_path}" alt="${anime.anime_name}" 
                            class="w-full h-64 object-cover rounded-t-lg group-hover:opacity-80 transition-all duration-300"
                            onerror="this.onerror=null; this.src='/api/placeholder/320/480';">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <button class="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transform scale-90 group-hover:scale-100 transition-all duration-300">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-4 bg-gray-800 rounded-b-lg">
                        <h3 class="text-xl font-semibold text-white truncate">${anime.anime_name}</h3>
                        <p class="text-gray-400 text-sm mb-3">${anime.genres?.join(', ') || 'Unknown'}</p>
                        <button class="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-300 flex items-center justify-center"
                                onclick="loadEpisodes('/anime/${anime.slug}')">
                            <i class="fas fa-list mr-2"></i> View Episodes
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            animeListContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-5xl text-gray-700 mb-4"><i class="fas fa-search"></i></div>
                    <h3 class="text-2xl font-bold text-white mb-2">No Anime Found</h3>
                    <p class="text-gray-400">Try adjusting your search or filters</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error searching anime:", error);
        animeListContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-5xl text-gray-700 mb-4"><i class="fas fa-exclamation-circle"></i></div>
                <h3 class="text-2xl font-bold text-white mb-2">Error</h3>
                <p class="text-gray-400">Unable to fetch search results. Please try again later.</p>
            </div>
        `;
    }
};

// Fix category filtering functionality
const filterAnimeByCategory = async (category) => {
    const animeListContainer = document.getElementById("anime-list");

    // Show loading state
    animeListContainer.innerHTML = Array(10).fill(0).map(() => `
        <div class="animate-pulse">
            <div class="bg-gray-700 h-64 rounded-t-lg"></div>
            <div class="p-4 bg-gray-800 rounded-b-lg">
                <div class="h-6 bg-gray-700 rounded mb-3"></div>
                <div class="h-4 bg-gray-700 rounded mb-3 w-3/4"></div>
                <div class="h-8 bg-gray-700 rounded"></div>
            </div>
        </div>
    `).join('');

    try {
        // Use the correct API parameter for filtering categories
        const response = await fetch(`https://api.animeiat.co/v1/anime?filter=${category}`);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }

        const rawData = await response.json();
        const data = rawData.data || [];

        if (data.length > 0) {
            animeListContainer.innerHTML = data.map(anime => `
                <div class="anime-item rounded-lg overflow-hidden shadow-lg group relative">
                    <div class="relative">
                        <img src="https://api.animeiat.co/storage/${anime.poster_path}" alt="${anime.anime_name}" 
                            class="w-full h-64 object-cover rounded-t-lg group-hover:opacity-80 transition-all duration-300"
                            onerror="this.onerror=null; this.src='/api/placeholder/320/480';">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <button class="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transform scale-90 group-hover:scale-100 transition-all duration-300">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-4 bg-gray-800 rounded-b-lg">
                        <h3 class="text-xl font-semibold text-white truncate">${anime.anime_name}</h3>
                        <p class="text-gray-400 text-sm mb-3">${anime.genres?.join(', ') || 'Unknown'}</p>
                        <button class="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-300 flex items-center justify-center"
                                onclick="loadEpisodes('/anime/${anime.slug}')">
                            <i class="fas fa-list mr-2"></i> View Episodes
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            animeListContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-5xl text-gray-700 mb-4"><i class="fas fa-search"></i></div>
                    <h3 class="text-2xl font-bold text-white mb-2">No Anime Found</h3>
                    <p class="text-gray-400">Try selecting a different category</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error filtering anime by category:", error);
        animeListContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-5xl text-gray-700 mb-4"><i class="fas fa-exclamation-circle"></i></div>
                <h3 class="text-2xl font-bold text-white mb-2">Error</h3>
                <p class="text-gray-400">Unable to fetch anime for this category. Please try again later.</p>
            </div>
        `;
    }
};

// Attach search functionality to the search button
document.querySelector('.search-button').addEventListener('click', () => {
    const query = document.querySelector('input[type="text"]').value.trim();
    if (query) {
        searchAnime(query);
    }
});

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    renderAnimeList();
    
    // Implement mobile menu toggle functionality
    const menuBtn = document.createElement("button");
    menuBtn.className = "md:hidden text-white p-2";
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    menuBtn.onclick = () => {
        const nav = document.querySelector("header nav");
        nav.classList.toggle("hidden");
        nav.classList.toggle("flex");
        nav.classList.toggle("flex-col");
        nav.classList.toggle("absolute");
        nav.classList.toggle("top-16");
        nav.classList.toggle("left-0");
        nav.classList.toggle("w-full");
        nav.classList.toggle("bg-black");
        nav.classList.toggle("p-4");
    };
    
    document.querySelector("header .container").appendChild(menuBtn);
    document.querySelector("header nav").classList.add("md:flex", "hidden");
});