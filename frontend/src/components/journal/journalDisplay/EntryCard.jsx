import { Link } from "react-router-dom"
import Modal from "./Modal"
export default function EntryCard(props) {


    function convertDate(date) {
        const convertedDate = new Date(date)
        return convertedDate.toLocaleDateString();
    }
    convertDate(props.entry.date)
    return (
        <>
            {/* <div>
                <time className="font-mono italic">{new Date(props.entry.date).toLocaleDateString()}</time>
                <div className="text-lg font-black">{props.entry.title}</div>
                <div>{props.entry.content}</div>
            </div> */}

            <div className="card bg-base-200 shadow-xl ">
                <div className="card-actions justify-end ">

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
                            <div className="md:text-7xl p-4 text-6xl ">
                                😐
                            </div>

                            <div className="card-body">
                                <time className="font-mono italic">{new Date(props.entry.date).toLocaleTimeString()}</time>
                                <div className="badge badge-secondary">Recent</div>
                                {props.entry.title && <h2 className="card-title text-lg font-black">{props.entry.title}</h2>}
                                <p>{props.entry.content}</p>
                                <div className="card-actions justify-end">

                                    <div className="badge badge-outline">{convertDate(props.entry.date)}</div>
                                    <div className="badge badge-outline">{props.entry.isPrivate ? "private" : "public"}</div>
                                </div>
                            </div>
                        </div>

                    </div>

                </Link>

            </div>
        </>
    )
}