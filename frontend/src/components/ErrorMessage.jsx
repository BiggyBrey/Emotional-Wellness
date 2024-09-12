export default function ErrorMessage(props) {
    return (
        <>
            <div className="badge badge-warning gap-2">

                {props.errorText}
            </div>
        </>
    )
}