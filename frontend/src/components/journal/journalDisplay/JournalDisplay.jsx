import { useEffect, useState } from "react";
import { getJournalById } from "../../../services/api"
import EntryCard from "./EntryCard";
import { Link } from "react-router-dom";

export default function JournalDisplay() {
    const [journal, setJournal] = useState({ entries: [] });
    const [searchText, setSearchText] = useState("")

    const userID = "66c65b7655e7bc5a73439ff0"

    const fetchJournal = async () => {
        const response = await getJournalById(userID)
        console.log(response.data)
        setJournal(response.data)

    }
    useEffect(() => {
        fetchJournal();
    }, [])

    const handleFilter = (e) => {
        const value = e.target.value;
        setSearchText(value);
    };

    return (
        <>
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

            <ul>
                {journal.entries
                    .filter(entry => entry.content.toLowerCase().includes(searchText.toLowerCase()))
                    .map((entry) => (
                        <li key={entry._id}>
                            <EntryCard entry={entry} />
                        </li>
                    ))
                    .reverse()}
            </ul>
        </>
    );
}
