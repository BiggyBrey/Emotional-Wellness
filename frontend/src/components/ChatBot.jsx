// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Configuration, OpenAIApi } from 'openai';

// // Initialize OpenAI API configuration
// const configuration = new Configuration({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
// });
// const openai = new OpenAI(import.meta.env.VITE_OPENAI_API_KEY);
// console.log(import.meta.env.VITE_OPENAI_API_KEY); // Should output your API key

// function ChatBot() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const navigate = useNavigate();

//   const handleSendMessage = async () => {
//     if (input.trim()) {
//       const newMessages = [...messages, { user: 'You', text: input }];
//       setMessages(newMessages);
//       setInput('');

//       await generateBotResponse(input, newMessages);
//     }
//   };

 
//       // Make request to OpenAI API
//       const generateBotResponse = async (userMessage, newMessages) => {
//         try {
//           const response = await fetch('https://api.openai.com/v1/completions', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
//             },
//             body: JSON.stringify({
//               model: 'text-davinci-003',
//               prompt: userMessage,
//               max_tokens: 150,
//               temperature: 0.7,
//             }),
//           });
      
//           const data = await response.json();
//           const botMessage = {
//             user: 'AI Therapist',
//             text: data.choices[0].text.trim(),
//           };
      
//           setTimeout(() => {
//             setMessages((prevMessages) => [...prevMessages, botMessage]);
//           }, 1000);
//         } catch (error) {
//           console.error('Error fetching AI response:', error);
//         }
//       };

//   return (
//     <div>
//       <h2>Therapist ChatBot</h2>
//       <div className="chat-box">
//         {messages.map((msg, index) => (
//           <div key={index}>
//             <strong>{msg.user}: </strong> {msg.text}
//           </div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type your message"
//       />
//       <button onClick={handleSendMessage}>Send</button>

//       {/* Button to navigate to Quiz */}
//       <button onClick={() => navigate('/quiz')}>Take Quiz</button>
//     </div>
//   );
// }

// export default ChatBot;