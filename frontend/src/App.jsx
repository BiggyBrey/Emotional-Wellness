import './App.css'
import Landing from './Landing'

import { Outlet } from 'react-router-dom'

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
    
    
    <Outlet/>
    </>
  );
}

export default App;
