import { useEffect, useState } from "react"
//css doesnt work on refresh?
import "./journalstyle.css"
// import Navbar from ""
import { createJournal, updateJournal } from "../../services/api"
import { useNavigate, useLocation } from "react-router-dom"
export default function JournalPage() {

    //i can either pull from local storage or usecontext
    const userID = JSON.parse(localStorage.getItem("userID"))

    const navigate = useNavigate()
    //context localstorage, session, url, 
    const location = useLocation();
    const entry = location.state;

    const [isUpdate, setIsUpdate] = useState(
        () => {
            return entry ? true : false
        }
    )
    const date = new Date() //get todays date
    const [EntryID, setEntryID] = useState(() => {
        //if entry exists or updating
        return entry ? entry._id : ""

    })
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
        navigate("/journals")
        window.scrollTo(0, 0); // Scroll to the top of the page
    }
    const handleCreateJournal = async () => {
        if (!NewEntry.content) return;
        const newJournal = await createJournal(NewEntry)
        // setIsUpdate(true)
        // let length = newJournal.data.Journal.entries.length - 1
        // setEntryID(newJournal.data.Journal.entries[length]._id)
        navigate("/journals")
        window.scrollTo(0, 0); // Scroll to the top of the page
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
            {/* <Navbar /> */}
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

        </>
    )
}