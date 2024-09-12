import { useState } from "react"
import AiJournalModal from "./AiJournalModal"
export default function JournalHistory(props) {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <div
                className="flex justify-between p-2 m-1"
                onMouseLeave={() => { setShowModal(false) }}
                onMouseEnter={() => { setShowModal(true) }}>
                <div>
                    {props.mood} {props.content}
                </div>


                {showModal &&
                    <AiJournalModal
                        deleteChat={props.deleteChat}
                        convoID={props.convoID}
                        content={props.content}
                    />
                }
            </div>
        </>
    )
}