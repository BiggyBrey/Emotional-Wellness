import React, { useEffect } from'react';

const landingScrolling = () => {
  useEffect(() => {
    const anchorLinks = document.querySelectorAll('nav a[href^="#"]');
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  }, []);
};

export default landingScrolling;
