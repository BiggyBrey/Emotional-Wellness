import "./DashPageStyles.css";
import React, { useEffect, useState } from 'react';
import { useLoaderData, useLocation } from 'react-router-dom';
import { getAiChatById, startAiChat, continueAiChat, deleteConversation } from "../../services/openAiApi.js";
import { getUserById } from "../../services/api.js";
import { requireAuth } from '../../services/UserAuth';
import ErrorMessage from "../ErrorMessage.jsx";
import { ChevronRight, Send } from 'lucide-react';
import JournalHistory from "../JournalHistory.jsx";

//check for auth then get journal by userid from local storage
export async function loader() {
  await requireAuth()
  const response = await getAiChatById(JSON.parse(localStorage.getItem("userID")))
  const user = await getUserById(JSON.parse(localStorage.getItem("userID")))
  return { aiChat: response.data, user: user.data }
}
const DashPage = () => {

  let userID = JSON.parse(localStorage.getItem("userID"));
  const date = new Date();
  //context localstorage, session, url, 
  const location = useLocation();
  const [entry, setEntry] = useState(location.state)
  console.log("entry:", entry)
  // chat bot code
  const loader = useLoaderData(); // UseLoaderData will provide the initial data
  console.log(loader)
  const [conversations, setConversations] = useState(loader.aiChat.conversations); // previous conversations - display in drawer
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


  const [inputMessage, setInputMessage] = useState(entry?.content || "");
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [convoID, setConvoID] = useState("");
  const [showEmoji, setShowEmojis] = useState(false);
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const reloadData = async () => {
    const response = await getAiChatById(userID)
    setConversations(response.data.conversations)
    console.log(response.data)
  }
  let lastDate = null;
  // useEffect(() => {
  //   reloadData()
  // }, [conversations])
  console.log("messages :", messages)
  console.log("convo :", conversations)

  const handleSendMessage = async () => {
    setIsError(false)
    if (inputMessage.trim() && (selectedEmoji || !isNewConversation)) {
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
        const response = await startAiChat({ userID, message: inputMessage, isNewConversation, mood: selectedEmoji, title: entry?.title });
        console.log(response.data)

        aiResponse = response.data.aiResponse
        // Add the new conversation to the conversations list
        const newConversation = response.data.convo;
        setConversations(prevConversations => [...prevConversations, newConversation]);
      } else {
        const response = await startAiChat({ userID, message: inputMessage, isNewConversation, title: entry?.title });
        console.log(response.data)
        aiResponse = response.data.aiResponse
      }
      console.log("aireponse", aiResponse)

      setIsNewConversation(false);
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setEntry(null)
      await reloadData()
    }
    else if (!inputMessage.trim()) {
      setIsError(true)
      setErrorMessage("Please tell us about your day first")
    }
    else {
      setIsError(true)
      setErrorMessage("Please select a mood")
    }
  };

  const startNewConversation = () => {
    //reset everything
    setSelectedEmoji(null)
    setMessages([]);
    setIsNewConversation(true); // Make new conversation flag true
    setConvoID("")
    setInputMessage("")
    setEntry(null)
  };

  const loadConversation = async (convoID) => {
    let convo = conversations.find(convo => convo._id === convoID);
    if (convo) {
      setMessages(convo.messages.slice(1)); // Remove system role
    }
    setConvoID(convoID)
    setIsNewConversation(false)
    setSelectedEmoji(convo.mood)

  };
  // List of emojis    
  const emojis = ['😢', '😠', '😒', '😈', '😐', '😴', '🥰', '😀', '🥳'];

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
  const handleDeleteChat = async (userID, convoID) => {
    await deleteConversation(userID, convoID);
    //reload pg
    setConversations(conversations.filter(convo => convo._id !== convoID))
    setMessages([])
    startNewConversation()
    // window.location.reload();


  }

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
      <div className="drawer lg:drawer-open ">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle " />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}

          <div className="max-h-screen flex flex-col items-center p-4">
            {/* Top Section with 3 Oval Buttons */}
            <div className="text-center text-4xl font-bold text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]">
              Welcome {loader.user.username} !
            </div>

            <div className="h-40 top-buttons grid w-full auto-rows-auto grid">
              {/* <div className="w-full flex justify-between items-start mb-2 ">

                <div className="flex space-x-4">
                  <button className="btn btn-primary btn-wide rounded-full shadow-md ">Sign up</button>
                  <button className="btn btn-secondary btn-wide rounded-full shadow-md">Login</button>
                </div>
                <button className="btn btn-accent btn-wide rounded-full shadow-md">Mood Metrics</button>
              </div> */}
            </div>

            {/* Input Section */}

            <div className="extra-vh items-center space-x-4 relative">
              {/* display error message here on incomplete inputs */}
              {isError && <ErrorMessage errorText={errorMessage} />}
              <div className="flex items-center justify-center space-x-4 relative">
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

                <label className="input input-bordered flex rounded-full items-center gap-2">
                  <input
                    name="content"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    type="text"
                    placeholder="Share your day and an Emoji ..."
                    className="input  w-96"
                  />
                  {/* cant chaneg emojis on started convos */}
                  <button disabled={selectedEmoji && !isNewConversation} onClick={() => setShowEmojis(!showEmoji)}>
                    {selectedEmoji ? selectedEmoji : "🤔"}
                  </button>
                </label>
                {/* submit button */}
                <button
                  onClick={handleSendMessage}
                  className="btn btn-circle btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </button>

              </div>
              {/* chat/message history */}
              <div className=" flex-grow h-5/6 overflow-auto mb-4 bg-white bg-opacity-50 mt-8 rounded-lg shadow-md p-4">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 max-w-full shadow-md rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-sky-600 text-white'}`}>
                      {message.content}
                    </span>
                  </div>
                )).reverse()}
                {/* old messages at bottom, most recent at top */}
              </div>
            </div>


          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full pt-12 w-80 p-4">
            {/* Sidebar content here */}
            {/* display previous entries / journals */}
            <div className="absolute top-0 right-4">
              <button onClick={startNewConversation} className="btn btn-ghost btn-square">
                <svg width="18" height="18" viewBox="0 0 48 48" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 42H43" stroke="currentColor" strokeWidth="4" strokeLinecap="butt" strokeLinejoin="bevel"></path>
                  <path d="M11 26.7199V34H18.3172L39 13.3081L31.6951 6L11 26.7199Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="bevel"></path>
                </svg>
              </button>
            </div>
            {/* journal / history */}
            <p>Journal History</p>
            {conversations.map((chat, index) => (
              <li onClick={() => loadConversation(chat._id)} key={chat._id}>
                <JournalHistory
                  date={chat.startedAt}
                  updated={chat.updatedAt}
                  mood={chat.mood}
                  content={chat.title || chat.summary}
                  deleteChat={handleDeleteChat}
                  convoID={chat._id}
                />
              </li>
            )).reverse()}
            {/* old messages at bottom, most recent at top */}
          </ul>
        </div>
      </div>
    </>

  );
};

export default DashPage;
