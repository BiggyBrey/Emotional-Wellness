import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <h1>Test Text</h1>
      <button>
        <Link to="/Dashboard">Dashboard Link</Link>
      </button>
    </>
  );
}

export default App;
