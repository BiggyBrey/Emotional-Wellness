import React, { useState } from 'react';
import './LandingStyles.css';

const Landing = () => {
    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div>
            <header>
                <div className="logo">
                    <img src="logo.png" alt="Company Logo" />
                    <h1>Company Name</h1>
                </div>
            </header>

            <main>
                <section className="content">
                    <div className="image-box">
                        <img src="plant.jpg" alt="Plants" />
                    </div>
                    <div className="info-box">
                        <h2>About Our Plants</h2>
                        <p>Information about the plants we use...</p>
                    </div>
                </section>

                <section className="content">
                    <div className="image-box">
                        <img src="ocean.jpg" alt="Ocean" />
                    </div>
                    <div className="info-box">
                        <h2>Our Ocean Conservation</h2>
                        <p>Information about our ocean conservation efforts...</p>
                    </div>
                </section>

                <button id="signup-btn" onClick={toggleForm}>Sign Up</button>
            </main>

            {showForm && (
                <div id="signup-form" className="popup-form">
                    <div className="form-container">
                        <span id="close-btn" onClick={toggleForm}>&times;</span>
                        <h2>Sign Up</h2>
                        <form>
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" required />
                            
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" required />

                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    
    );
};

export default Landing;