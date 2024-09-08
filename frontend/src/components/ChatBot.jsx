import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { getAiChatById, startAiChat, continueAiChat } from '../services/openAiApi';
import { requireAuth } from '../services/UserAuth';
import { ChevronRight, Send } from 'lucide-react';
// import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
const nudePalette = {
  background: '#F3E5DC',
  primary: '#D2B48C',
  secondary: '#A67B5B',
  text: '#4A3728',
  accent: '#8B4513'
};

//check for auth then get journal by userid from local storage
export async function loader() {
  await requireAuth()
  const response = await getAiChatById(JSON.parse(localStorage.getItem("userID")))
  return response.data
}

const ChatBot = () => {
  const loadedAiChat = useLoaderData(); // UseLoaderData will provide the initial data
  const [conversations, setConversations] = useState(loadedAiChat.conversations); // Store conversations in local state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [convoID, setConvoID] = useState("");
  let userID = JSON.parse(localStorage.getItem("userID"));

  console.log("messages :", messages)
  console.log("convo :", conversations)

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { content: inputMessage, role: 'user' }]);
      setInputMessage('');

      let aiResponse;
      // on pg start/ refresh or new button
      if (isNewConversation) {
        const response = await startAiChat({ userID, message: inputMessage, isNewConversation });

        aiResponse = response.data.aiResponse
        console.log("response :", response.data)
        console.log("aireponse", aiResponse)
        // Add the new conversation to the conversations list
        const newConversation = response.data.convo;
        setConversations(prevConversations => [...prevConversations, newConversation]);
      }
      // on navbar convo link
      if (convoID) {
        const response = await continueAiChat(convoID, { userID, message: inputMessage })
        console.log(response.data)
        aiResponse = response.data.aiResponse

      }

      setIsNewConversation(false);
      setMessages(prevMessages => [...prevMessages, aiResponse]);


    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setIsNewConversation(true); // Make new conversation flag true
    setConvoID("")
  };

  const loadConversation = (convoID) => {
    let convo = conversations.find(convo => convo._id === convoID);
    if (convo) {
      setMessages(convo.messages.slice(1)); // Remove system role
    }
    setConvoID(convoID)
    setIsNewConversation(false)
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizAnswer = (question, answer) => {
    setQuizAnswers({ ...quizAnswers, [question]: answer });
  };

  const handleSubmitQuiz = () => {
    setShowQuiz(false);
    setMessages(prevMessages => [...prevMessages, {
      content: "Thanks for completing the quiz! I've got some insights to share with you.",
      role: 'bot'
    }]);
  };

  return (
    <>
      <div className="drawer md:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button md:hidden">
            See all Convos
          </label>
          <div className="flex flex-col h-screen w-full bg-[#F3E5DC] text-[#4A3728] p-4">
            <h1 className="text-3xl font-bold mb-4 text-center text-[#8B4513]">Life Coach AI</h1>
            <div className="flex-grow overflow-auto mb-4 bg-white rounded-lg shadow-md p-4">
              {messages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-[#D2B48C] text-white' : 'bg-[#A67B5B] text-white'}`}>
                    {message.content}
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
          </div>
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 pt-14 relative">
            <div className="absolute top-0 right-4">
              <button onClick={startNewConversation} className="btn btn-ghost btn-square">
                <svg width="18" height="18" viewBox="0 0 48 48" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 42H43" stroke="currentColor" strokeWidth="4" strokeLinecap="butt" strokeLinejoin="bevel"></path>
                  <path d="M11 26.7199V34H18.3172L39 13.3081L31.6951 6L11 26.7199Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="bevel"></path>
                </svg>
              </button>
            </div>
            {conversations.map((chat, index) => (
              <li onClick={() => loadConversation(chat._id)} key={chat._id}>
                <div>{chat.messages[1].content}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ChatBot;