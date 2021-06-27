import "./buckets.styles.scss";
import { Bucket } from "../bucket/bucket.component";

export const Buckets = ({ bucketA, bucketB }) => (
  <div className="buckets">
    <Bucket bucketA={bucketA} title={"Bucket A"}></Bucket>

    <Bucket bucketB={bucketB} title={"Bucket B"}></Bucket>
  </div>
);
