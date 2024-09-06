import './App.css'
import Landing from './Landing'
import Footer from './components/userDashboard/Footer'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar';

function App() {
  
    // useEffect(() => {
    //   const anchorLinks = document.querySelectorAll('nav a[href^="#"]');
    //   anchorLinks.forEach(anchor => {
    //     anchor.addEventListener('click', function(e) {
    //       e.preventDefault();
    //       document.querySelector(this.getAttribute('href')).scrollIntoView({
    //         behavior: 'smooth'
    //       });
    //     });
    //   });
    // }, []);
  
  return (
    <>
    <Navbar/>
    
    <Outlet/>
    <Footer/>
    </>
  );
}

export default App;
