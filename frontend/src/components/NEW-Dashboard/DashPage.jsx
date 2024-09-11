import "./DashPageStyles.css";
import AiJournal from '../AiJournal';

import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { getAiChatById, startAiChat, continueAiChat } from "../../services/openAiApi.js";
import { requireAuth } from '../../services/UserAuth';
import { ChevronRight, Send } from 'lucide-react';
import JournalHistory from "../JournalHistory.jsx";

//check for auth then get journal by userid from local storage
export async function loader() {
  await requireAuth()
  const response = await getAiChatById(JSON.parse(localStorage.getItem("userID")))
  return response.data
}
const DashPage = () => {

  let userID = JSON.parse(localStorage.getItem("userID"));
  const date = new Date();
  // chat bot code
  const loadedAiChat = useLoaderData(); // UseLoaderData will provide the initial data
  console.log(loadedAiChat)
  const [conversations, setConversations] = useState(loadedAiChat.conversations); // previous conversations - display in drawer
  // const [conversation, setConversation] = useState()
  const [messages, setMessages] = useState([]); // messages btwn user and ai
  // State to store the selected emoji
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [newConversation, setNewConversation] = useState(() => ({
    userID: userID,
    title: "", // `${date.toDateString()} conversation`,
    mood: selectedEmoji,
    messages: messages,
    isPrivate: false,
    startedAt: date,
  }));


  const [inputMessage, setInputMessage] = useState('');
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [convoID, setConvoID] = useState("");
  const [showEmoji, setShowEmojis] = useState(false);

  const reloadData = async () => {
    const response = await getAiChatById(userID)
    console.log(response.data)
  }
  // useEffect(() => {
  //     reloadData()
  // }, [conversations, messages])
  console.log("messages :", messages)
  console.log("convo :", conversations)

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { content: inputMessage, role: 'user' }]);
      setInputMessage('');

      let aiResponse;
      // on navbar convo link
      if (convoID) {
        const response = await continueAiChat(convoID, { userID, message: inputMessage })
        console.log(response.data)
        aiResponse = response.data.aiResponse
        console.log("aireponse", aiResponse)
        // on pg start/ refresh or new button
      } else if (isNewConversation) {
        console.log(selectedEmoji)
        const response = await startAiChat({ userID, message: inputMessage, isNewConversation, mood: selectedEmoji });
        console.log(response.data)

        aiResponse = response.data.aiResponse
        // Add the new conversation to the conversations list
        const newConversation = response.data.convo;
        setConversations(prevConversations => [...prevConversations, newConversation]);
      } else {
        const response = await startAiChat({ userID, message: inputMessage, isNewConversation });
        console.log(response.data)
        aiResponse = response.data.aiResponse
      }
      console.log("aireponse", aiResponse)

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
  // List of emojis    ☹ 😢 🥰
  const emojis = ['😀', '😂', '😍', '🥳', '😎', '🤔', '😠', '🙌', '😐'];

  // Function to handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setShowEmojis(false)
  };
  // journal code
  //i can either pull from local storage or usecontext
  // const userID = JSON.parse(localStorage.getItem("userID"))
  // const [isUpdate, setIsUpdate] = useState(
  //     () => {
  //         return conversation ? true : false
  //     }
  // )
  // const [conversationID, setconversationID] = useState(() => {
  //     //if conversation exists or updating
  //     return conversation ? conversation._id : ""

  // })

  const handleUpdateJournal = async () => {
    if (!newConversation.content) return;
    await updateJournal(newConversation.userID, conversationID, newConversation)
    alert("journal updated")
  }
  // const handleCreateJournal = async () => {
  //     if (!newConversation.content) return;
  //     const newJournal = await createJournal(newConversation)
  //     alert("journal made");
  //     setIsUpdate(true)
  //     let length = newJournal.data.Journal.entries.length - 1
  //     setconversationID(newJournal.data.Journal.entries[length]._id)
  // }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setnewConversation({ ...newConversation, [name]: value })

  }
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setnewConversation({ ...newConversation, [name]: checked })

  }
  //emojis
  // click on the emoji
  // a new div above the input box appears
  // you can select an emoji from that div
  // the selected emoji would replace the default one
  return (
    <>
      {/* nav/bar */}
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}

          <div className="max-h-screen flex flex-col items-center p-4">
            {/* Top Section with 3 Oval Buttons */}
            <div className="h-1/2 top-buttons grid w-full auto-rows-auto grid">
              <div className="w-full flex justify-between items-start mb-8 ">
                <div className="flex space-x-4">
                  <button className="btn btn-primary btn-wide rounded-full shadow-md ">Sign up</button>
                  <button className="btn btn-secondary btn-wide rounded-full shadow-md">Login</button>
                </div>
                <button className="btn btn-accent btn-wide rounded-full shadow-md">Mood Metrics</button>
              </div>
            </div>

            {/* Input Section */}


            <div className="extra-vh flex items-center space-x-4 relative">

              <div className="flex items-center space-x-4 relative">
                <div>
                  {showEmoji &&
                    (< div className="flex gap-4 mb-5 absolute -top-16 right-0">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          className="emoji-button text-3xl "
                          onClick={() => handleEmojiSelect(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>)
                  }


                </div>
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                  See all Convos...
                </label>

                {/* daisy */}

                <label className="input input-bordered text-slate-200 flex rounded-full items-center gap-2">
                  <input
                    type="text"
                    placeholder="Share your day and an Emoji ..."
                    className="input input-bordered input-lg grow w-96"
                  />

                  <button onClick={() => setShowEmojis(!showEmoji)}>
                    {selectedEmoji ? selectedEmoji : "🤔"}
                  </button>
                </label>
                <button className="btn btn-circle btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </button>
              </div>

            </div>


          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li><a>Sidebar Item 1</a></li>
            <li><a>Sidebar Item 2</a></li>
          </ul>
        </div>
      </div>


    </>

  );
};

export default DashPage;
