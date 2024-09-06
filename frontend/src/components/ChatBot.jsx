import React, { useState } from 'react';
import { ChevronRight, Send } from 'lucide-react';
// import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
const nudePalette = {
  background: '#F3E5DC',
  primary: '#D2B48C',
  secondary: '#A67B5B',
  text: '#4A3728',
  accent: '#8B4513'
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      // Simulate bot response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { 
          text: "That's interesting! Let's dive deeper into how you're feeling today.", 
          sender: 'bot' 
        }]);
      }, 1000);
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizAnswer = (question, answer) => {
    setQuizAnswers({ ...quizAnswers, [question]: answer });
  };

  const handleSubmitQuiz = () => {
    setShowQuiz(false);
    // Process quiz answers here
    setMessages(prevMessages => [...prevMessages, { 
      text: "Thanks for completing the quiz! I've got some insights to share with you.", 
      sender: 'bot' 
    }]);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3E5DC] text-[#4A3728] p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-[#8B4513]">Life Coach AI</h1>
      <div className="flex-grow overflow-auto mb-4 bg-white rounded-lg shadow-md p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${
              message.sender === 'user' ? 'bg-[#D2B48C] text-white' : 'bg-[#A67B5B] text-white'
            }`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow p-2 rounded-l-lg border-2 border-[#D2B48C] focus:outline-none focus:border-[#8B4513]"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-[#D2B48C] text-white p-2 rounded-r-lg hover:bg-[#8B4513] transition-colors"
        >
          <Send size={24} />
        </button>
      </div>
      <button
        onClick={handleStartQuiz}
        className="mt-4 bg-[#8B4513] text-white p-2 rounded-lg hover:bg-[#A67B5B] transition-colors flex items-center justify-center"
      >
        Start Daily Assessment <ChevronRight size={24} />
      </button>
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-[#8B4513]">Daily Assessment</h2>
            <div className="mb-4">
              <p className="mb-2">How would you rate your mood today?</p>
              {['😞', '😐', '😊', '😄'].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer('mood', index)}
                  className={`mr-2 text-2xl ${quizAnswers.mood === index ? 'border-2 border-[#8B4513] rounded-full' : ''}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <p className="mb-2">What's one thing you'd like to improve?</p>
              <input
                type="text"
                onChange={(e) => handleQuizAnswer('improvement', e.target.value)}
                className="w-full p-2 border-2 border-[#D2B48C] rounded-lg"
              />
            </div>
            <button
              onClick={handleSubmitQuiz}
              className="w-full bg-[#8B4513] text-white p-2 rounded-lg hover:bg-[#A67B5B] transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {/* <Alert className="mt-4 bg-[#D2B48C] text-[#4A3728] border-[#8B4513]">
        <AlertTitle>Tip of the day</AlertTitle>
        <AlertDescription>
          Take a moment to practice gratitude. What are three things you're thankful for today?
        </AlertDescription>
      </Alert> */}
    </div>
  );
};

export default ChatBot;