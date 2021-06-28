import "./buckets.styles.scss";
import { Bucket } from "../bucket/bucket.component";

export const Buckets = ({ bucketA, bucketB, onSetBucketA, onSetBucketB }) => (
  <div className="buckets">
    <Bucket
      bucketA={bucketA}
      title={"Bucket A"}
      onSetBucketA={onSetBucketA}
    ></Bucket>

    <Bucket
      bucketB={bucketB}
      title={"Bucket B"}
      onSetBucketB={onSetBucketB}
    ></Bucket>
  </div>
);
