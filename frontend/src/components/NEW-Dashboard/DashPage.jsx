import React from 'react';
import "./DashPageStyles.css";

const DashPage = () => {
  return (
    <div className="max-h-screen flex flex-col items-center p-4">
      {/* Top Section with 3 Oval Buttons */}
      <div className="h-1/2 top-buttons grid w-full auto-rows-auto grid">
      <div className="w-full flex justify-between items-start mb-8 ">
        <div className="flex space-x-4">
          <button className="btn btn-primary btn-wide rounded-full shadow-md ">Sign up</button>
          <button className="btn btn-secondary btn-wide rounded-full shadow-md">Login</button>
        </div>
        <button className="btn btn-accent btn-wide rounded-full shadow-md">Mood Metrics</button>
      </div>
      </div>

      {/* Input Section */}
      <div className="extra-vh flex items-center space-x-4">
        <input
          type="text"
          placeholder="Type something..."
          className="input input-bordered input-lg rounded-full w-80"
        />
        <button className="btn btn-circle btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DashPage;
