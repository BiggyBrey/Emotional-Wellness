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

            <div className="card my-8 bg-base-200 shadow-xl ">
                {/* <div className="card-actions justify-end ">

                    <Modal
                        handleDeleteStudent={props.handleDeleteStudent}
                        studentName={props.student.Name}
                        id={props.student._id}
                    />
                </div> */}
                {/* coudl have image from smily face */}
                <Link to={`/entry/${props.entry._id}`}
                    state={props.entry}>
                    <div className="lg:flex items-center justify-between">
                        {props.entry.title && <div className="shadow-xl p-1 my-2 bg-slate-50 rounded-md ">
                            {props.entry.title}
                        </div>
                        }
                        <div className="shadow-xl p-1 my-2 bg-slate-50 rounded-md ">
                            {convertDate(props.entry.date)}
                        </div>
                        <div className="shadow-xl p-1 my-2 bg-slate-50 rounded-md ">
                            {/* maybe have an ai summary rather than actual content */}
                            {/* or limit size on content */}
                            {props.entry.content}

                        </div>
                    </div>
                </Link>

            </div>
        </>
    )
}