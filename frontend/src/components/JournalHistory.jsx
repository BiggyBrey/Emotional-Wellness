import AiJournalModal from "./AiJournalModal"
export default function JournalHistory(props) {
    return (
        <>
            <div>
                {props.mood}
                {props.content}
                <AiJournalModal />
            </div>
        </>
    )
}