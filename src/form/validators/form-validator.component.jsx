export default function validateForm(bucketA, bucketB, bucketGoal) {
  let error = {};

  if (bucketGoal > bucketB) {
    /** Goal bucket cannot be larger than the largest bucket. */
    error = "Goal value cannot be more than values of bucket B";
  } else if (bucketA % 2 === 0 && bucketB % 2 === 0 && bucketGoal % 2 !== 0) {
    /**	Two even buckets cannot get result in an odd number. */
    error = "Two even buckets cannot result of an odd numbered goal value";
  }

  return error;
}
