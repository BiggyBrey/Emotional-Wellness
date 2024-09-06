function JournalCard() {
  return (
    <>
<div className="card card-bordered border-slate-600 bg-slate-300 w-96 shadow-xl">  
  <figure className="px-10 pt-10">
    <img
      src="https://i.etsystatic.com/13074475/c/650/516/0/94/il/927b6d/3520864573/il_340x270.3520864573_qxpx.jpg"
      alt="Journal Page"
      className="rounded-xl"
    />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Personal Journal</h2>

    <div className="card-actions">
      <button className="btn btn-primary">Journal</button>
    </div>
  </div>
</div>


    </>
  );
}
export default JournalCard;
