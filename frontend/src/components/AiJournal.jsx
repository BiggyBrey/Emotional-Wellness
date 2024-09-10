// user writes a journal entry + mood emoji
// using mood emoji, make api call to open ai as system prompt
// use journal entry as first message in chat
// get open ai response
// user can continue convo if need
// no more emojis needed for continued convos - emojis only needed for 1st per convo
// or create new ones
// or continue old convos 
// can see the all the convos and history of each
// cant edit messages - similar to convo

import JournalPage from "./journal/JournalPage";
import ChatBot from "./ChatBot";

import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { getAiChatById, startAiChat, continueAiChat } from '../services/openAiApi';
import { requireAuth } from '../services/UserAuth';
import { ChevronRight, Send } from 'lucide-react';

//check for auth then get journal by userid from local storage
export async function loader() {
    await requireAuth()
    const response = await getAiChatById(JSON.parse(localStorage.getItem("userID")))
    return response.data
}
export default function AiJournal() {
    // List of emojis    ☹ 😢 🥰
    const emojis = ['😀', '😂', '😍', '🥳', '😎', '🤔', '😠', '🙌', '😐'];

    // State to store the selected emoji
    const [selectedEmoji, setSelectedEmoji] = useState(null);

    // Function to handle emoji selection
    const handleEmojiSelect = (emoji) => {
        setSelectedEmoji(emoji);
    };
    // chat bot code
    const loadedAiChat = useLoaderData(); // UseLoaderData will provide the initial data
    console.log(loadedAiChat)
    const [conversations, setConversations] = useState(loadedAiChat.conversations); // Store conversations in local state
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
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
            // on navbar convo link
            if (convoID) {
                const response = await continueAiChat(convoID, { userID, message: inputMessage })
                console.log(response.data)
                aiResponse = response.data.aiResponse
                console.log("aireponse", aiResponse)
                // on pg start/ refresh or new button
            } else if (isNewConversation) {
                const response = await startAiChat({ userID, message: inputMessage, isNewConversation });
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

    // journal code
    //i can either pull from local storage or usecontext
    // const userID = JSON.parse(localStorage.getItem("userID"))

    // //context localstorage, session, url, 
    // const location = useLocation();
    // const entry = location.state;
    let entry;
    const [isUpdate, setIsUpdate] = useState(
        () => {
            return entry ? true : false
        }
    )
    const date = new Date() //get todays date
    // const [EntryID, setEntryID] = useState(() => {
    //     //if entry exists or updating
    //     return entry ? entry._id : ""

    // })

    const [NewEntry, setNewEntry] = useState(() => ({
        userID: userID,
        title: entry?.title || `${date.toDateString()} Entry`,
        content: entry?.content || "",
        isPrivate: entry?.isPrivate || false,
        date: entry?.date || date,
        aiAnalysis: entry?.aiAnalysis || "",
    }));
    // const [NewEntry, setNewEntry] = useState(
    //     () => {
    //         //entry exists/ updating
    //         if (entry) {
    //             return {
    //                 userID: "66c65b7655e7bc5a73439ff0",
    //                 title: entry.title,
    //                 content: entry.content,
    //                 isPrivate: entry.isPrivate,
    //                 date: entry.date,
    //                 aiAnalysis: entry.aiAnalysis,
    //             }
    //         } else {
    //             return { //creating new entry
    //                 userID: "66c65b7655e7bc5a73439ff0",
    //                 title: `${date.toDateString()} Entry`,
    //                 content: "",
    //                 isPrivate: false,
    //                 date: date,
    //                 aiAnalysis: "",
    //             }
    //         }
    //     }
    // )

    const handleUpdateJournal = async () => {
        if (!NewEntry.content) return;
        await updateJournal(NewEntry.userID, EntryID, NewEntry)
        alert("journal updated")
    }
    const handleCreateJournal = async () => {
        if (!NewEntry.content) return;
        const newJournal = await createJournal(NewEntry)
        alert("journal made");
        setIsUpdate(true)
        let length = newJournal.data.Journal.entries.length - 1
        setEntryID(newJournal.data.Journal.entries[length]._id)
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewEntry({ ...NewEntry, [name]: value })

    }
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target
        setNewEntry({ ...NewEntry, [name]: checked })

    }

    return (
        <>
            <div className="App">
                <h1>Choose an Emoji</h1>

                <div className="flex gap-4 mb-5">
                    {emojis.map((emoji, index) => (
                        <button
                            key={index}
                            className="emoji-button text-3xl bg-gray-100 "
                            onClick={() => handleEmojiSelect(emoji)}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                {selectedEmoji && (
                    <div className="selected-emoji">
                        <h2>You selected: {selectedEmoji}</h2>
                    </div>
                )}

                <style>{`

        .emoji-button {
          font-size: 2rem;
          padding: 10px;
          cursor: pointer;
          background: #f0f0f0;
          border: 2px solid #ccc;
          border-radius: 10px;
          transition: background 0.2s ease;
        }

        .emoji-button:hover {
          background: #e0e0e0;
        }

        .selected-emoji {
          font-size: 2rem;
          color: #333;
        }
      `}</style>
            </div>

            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-center justify-center">
                    {/* Page content here */}

                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                        Open drawer
                    </label>
                    {/* <JournalPage /> */}
                    <div className="container">

                        <header>
                            <div className="form-control">

                                <label className="cursor-pointer label flex justify-end gap-4">
                                    <span className="label-text">Hidden</span>
                                    <div className="tooltip" data-tip="Check to hide journal entry">
                                        <input type="checkbox" name="isPrivate" onChange={handleCheckboxChange} checked={NewEntry.isPrivate} className="checkbox checkbox-accent" />
                                    </div>

                                </label>


                            </div>
                            <h1>My Personal Journal</h1>

                            <h2>
                                <input className="input text-lg bg-inherit" placeholder="enter your own title" name="title" value={NewEntry.title} onChange={handleInputChange} type="text" />
                            </h2>
                            {/* <h2>{date.toLocaleDateString()}</h2> */}
                            {/* <h2>{date.toLocaleString()}</h2>
                    <h2>{`${date.toDateString()}, ${date.toLocaleTimeString()}`}</h2> */}
                            {/* potential prompt */}
                            <p>Today was an interesting day...</p>
                            {/* potential inspirational quote */}
                            <blockquote>“The only limit to our realization of tomorrow is our doubts of today.”</blockquote>
                        </header>

                        <article className="article">
                            {/* can have diff fonts */}
                            <textarea className=" bg-slate-100 text-slate-900 w-full h-screen" placeholder="Write your thoughts here . . ." name="content" value={NewEntry.content} onChange={handleInputChange}></textarea>
                        </article>

                        <footer>
                            {/* potential personal sign off */}
                            <p>Created with love.</p>
                        </footer>
                        {
                            isUpdate ? <button onClick={handleUpdateJournal} className="btn btn-ghost">Update</button> : <button onClick={handleCreateJournal} className="btn btn-ghost">Submit</button>

                        }

                    </div >

                    {/* chats */}
                    <div>
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
                    </div>


                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
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
                        {conversations.map((chat, index) => (
                            <li onClick={() => loadConversation(chat._id)} key={chat._id}>
                                <div>{chat.messages[1].content}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}