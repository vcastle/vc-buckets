import "./buckets.styles.scss";
import { Bucket } from '../bucket/bucket.component';

export const Buckets = () => (
    <div className="buckets">
        <Bucket title={'Bucket1'}>
        </Bucket>

        <Bucket title={'Bucket2'}>
        </Bucket>
    </div>
)