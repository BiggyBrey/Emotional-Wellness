import "./App.css";
import { Link } from "react-router-dom";
import Landing from "./Landing";
import landingScrolling from "./landingLogic";

function App() {
  return (
    <>
      <button>
        <Link to="/Dashboard">Dashboard Link</Link>
      </button>
      <Landing />
      <landingScrolling />
    </>
  );
}

export default App;
