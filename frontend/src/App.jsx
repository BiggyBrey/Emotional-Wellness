import './App.css'
import Footer from './components/userDashboard/Footer'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar';
import { UserAuth } from './services/UserAuth.jsx';

function App() {

  return (
    <>
      <UserAuth>
        <Navbar />

        <Outlet />
        <Footer />
      </UserAuth>

    </>
  );
}

export default App;
