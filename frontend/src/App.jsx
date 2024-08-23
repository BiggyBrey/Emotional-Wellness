import "./App.css";
import { Link } from "react-router-dom";
import Landing from "./Landing";
import landingScrolling from "./landingLogic";
import { useEffect } from "react";
function App() {
  
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
  
  return (
    <>
      <button>
        <Link to="/Dashboard">Dashboard Link</Link>
      </button>
      <Landing />
    
    </>
  );
}

export default App;
