import React from 'react';
import './HeroSection.css'; // Import the CSS file

const HeroSection = () => {
    return (
        <section className="hero" style={{ backgroundImage: "url('/api/placeholder/1200/500')" }}>
            <div className="overlay"></div>
            <div className="content">
                <h2>Stream Your Favorite Anime</h2>
                <p>Unlimited access to the latest and most popular anime titles.</p>
                <div className="buttons">
                    <button className="btn-primary">
                        <i className="fas fa-play"></i> Start Watching
                    </button>
                    <button className="btn-secondary">
                        <i className="fas fa-info-circle"></i> Learn More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
