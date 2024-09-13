import React from "react";
import landingScrolling from "./landingLogic";
import { Link } from "react-router-dom";
import SignUp from "./SignUp";

export async function action({ request }) {
  const formData = await request.formData()
  const username = formData.get("username")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirm-password")
  console.log(username, password, confirmPassword)
  try {
    // the user enters in username passowrd and confirm pass
    //check if username is available
    // if available proceed otherwise stop
    // check if confirm password = password
    // create a suer with username and passwsord
    //on successful sign in
    const response = await checkUsername(username)
    console.log(response.data)
    //check if username available
    if (!response.data.available) {
      console.log("username not available")
      return "username not available"
    }
    //check if passwors match
    if (password !== confirmPassword) {
      console.log('Passwords do not match!');
      return "Passwords do not match"
    }
    // create user
    const user = await createUser({ username, password })
    console.log("user created")
    console.log(user.data)
    // const response = await loginUser({ username, password })
    // console.log(response.data.userId)
    const userID = user.data.user._id;
    console.log(userID)
    localStorage.setItem("userID", JSON.stringify(userID))

    return redirect("/dashboard")

  }
  catch (error) {
    //on incorrect signin
    return error.response?.data.message || null
  }

}

const LandingPage = () => {
  landingScrolling();
  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">MindCare</h1>
          <nav>
            <a
              href="#about"
              className="text-gray-600 mx-4 hover:text-primary"
            >
              About
            </a>
            <a
              href="#services"
              className="text-gray-600 mx-4 hover:text-primary"
            >
              Services
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 mx-4 hover:text-primary"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-gray-600 mx-4 hover:text-primary"
            >
              Contact
            </a>
            <Link
              to="/login"
              className="text-gray-600 mx-4 hover:text-primary"
            >
              Login
            </Link>
            <a
              href="#signup"
              className="text-gray-600 mx-4 hover:text-primary"
            >
              Sign Up
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}

      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Your Mental Wellness Journey Begins Here
          </h2>
          <p className="text-lg">
            Discover peace, happiness, and mental clarity
          </p>

        </div>
        <button className="btn mt-96 btn-primary">Get Started</button>
      </div>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About MindCare</h2>
          <p className="text-lg max-w-2xl mx-auto">
            MindCare is dedicated to promoting mental wellness through
            accessible tools and supportive community. We believe that everyone
            deserves the opportunity to achieve peace of mind and emotional
            balance.
          </p>
        </div>
      </section>


      {/* Services Section */}
      <section id="services" className="bg-gray-200 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Services</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full sm:w-1/2 md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Ai </h3>
                <p>Speak with MindCare</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Journal Entires</h3>
                <p>Record and reflect your days in a journal</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Mood Metrics</h3>
                <p>Track your mood to systematically improve your days.</p>
              </div>
            </div>
          </div>
          {/* image of chat */}
          <div>
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-primary">What kind of nonsense is this</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-secondary">
                Put me on the Council and not make me a Master!??
              </div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-accent">
                That's never been done in the history of the Jedi. It's insulting!
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-info">Calm down, Anakin.</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-success">You have been given a great honor.</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-warning">To be on the Council at your age.</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-error">It's never happened before.</div>
            </div>
          </div>
          <div id="signup">

            <SignUp />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">What Our Users Say</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full sm:w-1/2 md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p>
                  "MindCare has completely changed my life. The mindfulness
                  practices have helped me find balance and peace." -{" "}
                  <strong>Jane D.</strong>
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p>
                  "The community support here is amazing. I've never felt more
                  connected and understood." - <strong>John S.</strong>
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p>
                  "Guided meditations have become a part of my daily routine.
                  It's been a game-changer for my mental health." -{" "}
                  <strong>Emily R.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="bg-primary py-20 text-center"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg mb-6">
            Join our community and start your mental wellness journey today.
          </p>
          <form className="max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 mb-4 rounded-lg text-gray-700"
            />
            <button
              type="submit"
              className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100"
            >
              Join Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
