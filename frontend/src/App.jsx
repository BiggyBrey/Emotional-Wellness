import './App.css'
import Footer from './components/userDashboard/Footer'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar';
import { UserAuth } from './services/UserAuth.jsx';
import { useLocation } from 'react-router-dom';
function App() {

  const location = useLocation()
  return (
    <>
      <UserAuth>
        {/* Render Navbar on all pages except the landing page */}
        {location.pathname !== '/landing' && <Navbar />}


        <Outlet />
        <Footer />
      </UserAuth>

    </>
  );
}

export default App;
