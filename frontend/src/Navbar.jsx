import { Link } from "react-router-dom"
import { signOut } from "./services/UserAuth.jsx"
function Navbar() {
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to="/Dashboard"><div className="btn btn-ghost normal-case text-xl">MindCare</div></Link>
        </div>
        <div className="flex-none">

          <Link to="/journals"><div className="btn btn-ghost">Journal</div></Link>
          <Link to="/Dashboard"><div className="btn btn-ghost">Mood Metrics</div></Link>
          <Link to="/chatbot"><div className="btn btn-ghost">Chatbot</div></Link>
          <Link to="/login"><div className="btn btn-ghost">Login</div></Link>
          <Link onClick={signOut} to="/"><div className="btn btn-ghost">Logout</div></Link>
        </div>
      </div>


    </>
  )
}
export default Navbar