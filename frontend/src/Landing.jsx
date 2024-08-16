import React from'react';

const LandingPage = () => {
  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md"><div className="container mx-auto p-4 flex justify-between items-center"><h1 className="text-2xl font-bold text-green-500">MindCare</h1><nav><a href="#about" className="text-gray-600 mx-4 hover:text-green-500">About</a><a href="#services" className="text-gray-600 mx-4 hover:text-green-500">Services</a><a href="#testimonials" className="text-gray-600 mx-4 hover:text-green-500">Testimonials</a><a href="#contact" className="text-gray-600 mx-4 hover:text-green-500">Contact</a></nav></div></header>

      {/* Hero Section */}
      <section className="bg-green-500 text-white py-20 text-center"><div className="container mx-auto"><h2 className="text-4xl font-bold mb-4">Your Mental Wellness Journey Begins Here</h2><p className="text-lg">Discover peace, happiness, and mental clarity</p></div></section>

      {/* About Section */}
      <section id="about"className="py-20"><div className="container mx-auto text-center"><h2 className="text-3xl font-bold mb-6">About MindCare</h2><p className="text-lg max-w-2xl mx-auto">MindCare is dedicated to promoting mental wellness through accessible tools and supportive community. We believe that everyone deserves the opportunity to achieve peace of mind and emotional balance.</p></div></section>

      {/* Services Section */}
      <section id="services"className="bg-gray-200 py-20"><div className="container mx-auto text-center"><h2 className="text-3xl font-bold mb-6">Our Services</h2><div className="flex flex-wrap justify-center"><div className="w-full sm:w-1/2 md:w-1/3 p-4"><div className="bg-white p-6 rounded-lg shadow-lg"><h3 className="text-xl font-bold mb-4">Guided Meditations</h3><p>Calm your mind and body with our carefully curated guided meditation sessions.</p></div></div><div className="w-full sm:w-1/2 md:w-1/3 p-4"><div className="bg-white p-6 rounded-lg shadow-lg"><h3 className="text-xl font-bold mb-4">Mindfulness Coaching</h3><p>One-on-one sessions to help you stay present and focused in your daily life.</p></div></div><div className="w-full sm:w-1/2 md:w-1/3 p-4"><div className="bg-white p-6 rounded-lg shadow-lg"><h3 className="text-xl font-bold mb-4">Community Support</h3><p>Join a community of like-minded individuals who support each other's mental wellness journey.</p></div></div></div></div></section>

      {/* Testimonials Section */}
      <section id="testimonials"className="py-20"><div className="container mx-auto text-center"><h2 className="text-3xl font-bold mb-6">What Our Users Say</h2><div className="flex flex-wrap justify-center"><div className="w-full sm:w-1/2 md:w-1/3 p-4"><div className="bg-white p-6 rounded-lg shadow-lg"><p>"MindCare has completely changed my life. The mindfulness practices have helped me find balance and peace." - <strong>Jane D.</strong></p></div></div><div className="w-full sm:w-1/2 md:w-1/3 p-4"><div className="bg-white p-6 rounded-lg shadow-lg"><p>"The community support here is amazing. I've never felt more connected and understood." - <strong>John S.</strong></p></div></div><div className="w-full sm:w-1/2 md:w-1/3 p-4"><div className="bg-white p-6 rounded-lg shadow-lg"><p>"Guided meditations have become a part of my daily routine. It's been a game-changer for my mental health." - <strong>Emily R.</strong></p></div></div></div></div></section>

      {/* Contact Section */}
      <section id="contact"className="bg-green-500 text-white py-20 text-center"><div className="container mx-auto"><h2 className="text-3xl font-bold mb-6">Get in Touch</h2><p className="text-lg mb-6">Join our community and start your mental wellness journey today.</p><form className="max-w-md mx-auto"><input type="email" placeholder="Enter your email" className="w-full p-4 mb-4 rounded-lg text-gray-700" /><button type="submit" className="bg-white text-green-500 px-8 py-4 rounded-lg font-bold hover:bg-gray-100">Join Now</button></form></div></section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6"><div className="container mx-auto text-center"><p>&copy; 2024 MindCare. All rights reserved.</p><div className="flex justify-center space-x-4 mt-4"><a href="#" className="hover:text-white">Facebook</a><a href="#" className="hover:text-white">Twitter</a><a href="#" className="hover:text-white">Instagram</a></div></div></footer></div>
  );
};

export default LandingPage;
