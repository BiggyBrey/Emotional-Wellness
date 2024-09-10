// user writes a journal conversation + mood emoji
// using mood emoji, make api call to open ai as system prompt
// use journal conversation as first message in chat
// get open ai response
// user can continue convo if need
// no more emojis needed for continued convos - emojis only needed for 1st per convo
// or create new ones
// or continue old convos 
// can see the all the convos and history of each
// cant edit messages - similar to convo

import React, { useEffect, useState } from 'react';
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

    return (
        <>

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
                                    <div className="tooltip" data-tip="Check to hide journal conversation">
                                        <input type="checkbox" name="isPrivate" onChange={handleCheckboxChange} checked={newConversation.isPrivate} className="checkbox checkbox-accent" />
                                    </div>

                                </label>


                            </div>
                            <h1 className="text-3xl font-bold mb-4 text-center text-[#8B4513]">
                                <input className="input text-lg bg-inherit" placeholder="enter your own title" name="title" value={newConversation.title} onChange={handleInputChange} type="text" />
                            </h1>
                            {/* <h2>{date.toLocaleDateString()}</h2> */}
                            {/* <h2>{date.toLocaleString()}</h2>
                    <h2>{`${date.toDateString()}, ${date.toLocaleTimeString()}`}</h2> */}
                            {/* potential prompt */}
                            <p>Today was an interesting day...</p>
                            {/* potential inspirational quote */}
                            <blockquote>“The only limit to our realization of tomorrow is our doubts of today.”</blockquote>
                        </header>
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


                        </div>
                        <div className="flex-grow overflow-auto mb-4 bg-white rounded-lg shadow-md p-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-[#D2B48C] text-white' : 'bg-[#A67B5B] text-white'}`}>
                                        {message.content}
                                    </span>
                                </div>
                            ))}
                        </div>


                        <article className="article">
                            {/* can have diff fonts */}
                            <textarea className=" bg-slate-100 text-slate-900 w-full h-96" placeholder="Write your thoughts here . . ." name="content" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}></textarea>
                        </article>

                        <footer>
                            {/* potential personal sign off */}
                            <p>Created with love.</p>
                        </footer>
                        {
                            /* isUpdate ? <button onClick={handleUpdateJournal} className="btn btn-ghost">Update</button> :*/ <button onClick={handleSendMessage} className="btn btn-ghost">Submit</button>

                        }

                    </div >

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