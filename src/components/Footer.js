import React from 'react';
import './Footer.css'; // Import the CSS file

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-columns">
                    <div>
                        <h4>AnimeStream</h4>
                        <p>Your ultimate destination for all things anime. Watch your favorite shows anytime, anywhere.</p>
                    </div>
                    <div>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/popular">Popular</a></li>
                            <li><a href="#genres">Genres</a></li>
                            <li><a href="#about">About</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-facebook"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 AnimeStream. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
