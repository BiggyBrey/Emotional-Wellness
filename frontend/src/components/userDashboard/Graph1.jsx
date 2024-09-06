function Graph1(props) {
  return (
    <>
      <div className="card card-bordered border-slate-600 bg-slate-300 w-96 shadow-xl">
        <figure className="px-10 pt-10">
          <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">Mood Metrics</h2>
              <div class="overflow-x-auto">{props.children}</div>
            </div>
          </div>
        </figure>
        <div className="card-body items-center text-center">
          <div className="card-actions">
            <button className="btn btn-primary">Mood Metrics</button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Graph1;
