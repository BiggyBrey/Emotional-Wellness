import { useEffect, useState } from "react";
import { deleteEntry, getJournalById } from "../../../services/api"
import EntryCard from "./EntryCard";
import { Link, useLoaderData } from "react-router-dom";
import { requireAuth } from "../../../services/UserAuth.jsx";
// idea to merge journals + journal - journals is sidebar

//check for auth then get journal by userid from local storage
export async function loader() {
    await requireAuth()
    const response = await getJournalById(JSON.parse(localStorage.getItem("userID")))
    return response.data
}

export default function JournalDisplay() {
    //get journal from loader
    const [journal, setJournal] = useState(useLoaderData());
    const [searchText, setSearchText] = useState("")
    //trouble with updating list on deletes
    //let journal = useLoaderData()

    //get user from use context
    const user = useLoaderData();
    // get user id
    const userID = user._id
    console.log(user._id)
    const fetchJournal = async () => {
        const response = await getJournalById(userID)
        console.log(response.data)
        //journal = response.data
        setJournal(response.data)

    }
    // useEffect(() => {
    //     fetchJournal();
    // }, [])

    const handleFilter = (e) => {
        const value = e.target.value;
        setSearchText(value);
    };

    const handleDeleteEntry = async (userID, EntryID) => {
        await deleteEntry(userID, EntryID);
        await fetchJournal();
        //filters out the deleted students
        // setFilteredStudents(students.filter(student => student._id !== id))

    }

    return (
        <>
            {/* <Navbar /> */}
            <div className="flex">
                <div className="flex-1">
                    <label className="input input-bordered flex items-center my-4 gap-2">
                        <input type="text" value={searchText} onChange={handleFilter} className="grow" placeholder="Search" />
                    </label>
                </div>
                <Link to="/write">
                    <button className="btn ml-2 btn-outline mt-4">New</button>
                </Link>
            </div>

            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                {journal.entries
                    .filter(entry => entry.content.toLowerCase().includes(searchText.toLowerCase()))
                    .map((entry, index) => (
                        < li key={entry._id} >
                            {index !== 0 && <hr />}
                            <div className="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className={index % 2 === 0 ? "timeline-start mb-10 md:text-end" : "timeline-end mb-10 md:text-start"}>
                                <time className="font-mono italic">{new Date(entry.date).toLocaleDateString()}</time>
                                {/* <div className="text-lg font-black">{entry.title}</div>
                                <div>{entry.content}</div> */}
                                {/* ... continue on content after number of chars */}
                                <EntryCard entry={entry}
                                    handleDeleteEntry={handleDeleteEntry}
                                />
                            </div>
                            <hr />
                        </li>

                    ))
                    .reverse()
                    // .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date
                }
            </ul >

            {/* <ul>
                {journal.entries
                    .filter(entry => entry.content.toLowerCase().includes(searchText.toLowerCase()))
                    .map((entry) => (
                        <li key={entry._id}>
                            <EntryCard entry={entry} />
                        </li>
                    ))
                    .reverse()}
            </ul> */}
        </>
    );
}
