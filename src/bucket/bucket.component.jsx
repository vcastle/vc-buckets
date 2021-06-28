import "./bucket.styles.scss";

export const Bucket = ({ title }) => (
  <div className="bucket">
    <h1 className="bucket__title">{title}</h1>
    {/** TODO: ADD CSS FOR FILLING TOP % BASED ON VALUE OF THE BUCKET */}
  </div>
);
