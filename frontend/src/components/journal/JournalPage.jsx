import { useEffect, useState } from "react"
import "./journalstyle.css"
import { createJournal, updateJournal } from "../../services/api"
export default function JournalPage() {
    const date = new Date() //get todays date
    const [NewEntry, setNewEntry] = useState({
        userID: "66c65b7655e7bc5a73439ff0",
        title: `${date.toDateString()} Entry`,
        content: "",
        isPrivate: false,
        date: date,
        aiAnalysis: "",
    })

    const handleUpdateJournal = async () => {

    }
    const handleCreateJournal = async () => {
        if (!NewEntry.content) return
        await createJournal(NewEntry)
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewEntry({ ...NewEntry, [name]: value })
        console.log(e.target)
    }

    return (
        <>
            <div className="container">

                <header>
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
                <button onClick={handleCreateJournal} className="btn btn-ghost">Submit</button>
            </div >

        </>
    )
}