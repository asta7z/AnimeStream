import React, { useState, useEffect } from 'react';
import { fetchVideoLinks } from '../utils/api';

const VideoPlayer = ({ episode }) => {
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sortVideosByQuality = (videos, quality) => {
        return videos.sort((a, b) => {
            if (a.quality === quality) return -1;
            if (b.quality === quality) return 1;
            return 0;
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchVideoLinks(episode.url.split('/').pop());
                if (!data || !data.sources || data.sources.length === 0) {
                    throw new Error("No video sources available");
                }
                const sortedVideos = sortVideosByQuality(data.sources, '1080');
                setVideoData({ ...data, sources: sortedVideos });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [episode]);

    if (loading) {
        return (
            <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading video...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden p-8 text-center">
                <div className="text-5xl text-gray-700 mb-4"><i className="fas fa-exclamation-circle"></i></div>
                <h3 className="text-2xl font-bold text-white mb-2">Video Unavailable</h3>
                <p className="text-gray-400 mb-6">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="relative pt-[56.25%]">
                <video id="video-player" controls className="absolute inset-0 w-full h-full" autoPlay>
                    <source src={videoData.sources[0].url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{videoData.title}</h3>
                <p className="text-gray-400 mb-4">{videoData.description}</p>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md flex items-center">
                        <i className="fas fa-step-backward mr-2"></i> Previous
                    </button>
                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center">
                        <i className="fas fa-step-forward mr-2"></i> Next Episode
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
