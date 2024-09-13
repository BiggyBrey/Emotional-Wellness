import { Link } from "react-router-dom"
import Modal from "./Modal"
export default function EntryCard(props) {


    function convertDate(date) {
        const convertedDate = new Date(date)
        return convertedDate.toLocaleDateString();
    }

    // if the given date is with a week of today then it is recent otherwise false
    function isRecent(date) {
        const givenDate = new Date(date);
        const today = new Date();
        const timeDifference = Math.abs(today - givenDate);
        const dayDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert time difference to days
        return dayDifference <= 7; // Check if the date is within 7 days (a week)
    }
    return (
        <>
            {/* <div>
                <time className="font-mono italic">{new Date(props.entry.date).toLocaleDateString()}</time>
                <div className="text-lg font-black">{props.entry.title}</div>
                <div>{props.entry.content}</div>
            </div> */}

            <div className="card bg-base-200 shadow-xl ">

                <div className="card-actions justify-between ">
                    {/* click on button
                    go to dashboard
                    start a convo with the content of the journal

                    */}
                    <Link
                        to="/dashboard"
                        state={props.entry}
                    >
                        <button className="btn">
                            Ask MindCare?
                        </button>
                    </Link>


                    <Modal
                        handleDeleteEntry={props.handleDeleteEntry}
                        EntryTitle={props.entry.title}
                        entryID={props.entry._id}
                    />
                </div>
                {/* coudl have image from smily face */}
                <Link to={`/entry/${props.entry._id}`}
                    state={props.entry}>

                    <div className="card card-compact card-side bg-base-200 shadow-xl">
                        <div className="flex justify-between items-center">
                            {/* <div className="md:text-7xl p-4 text-6xl ">
                                😐
                            </div> */}

                            <div className="card-body">
                                <time className="font-mono italic">{new Date(props.entry.date).toLocaleTimeString()}</time>
                                {isRecent(props.entry.date) && < div className="badge badge-secondary">Recent</div>}
                                {props.entry.title && <h2 className="card-title text-lg font-black">{props.entry.title}</h2>}
                                <p>{props.entry.content}</p>
                                <div className="card-actions justify-end">

                                    <div className="badge badge-outline">{convertDate(props.entry.date)}</div>
                                    <div className="badge badge-outline">{props.entry.isPrivate ? "private" : "public"}</div>
                                </div>
                            </div>
                        </div>

                    </div>

                </Link >

            </div >
        </>
    )
}