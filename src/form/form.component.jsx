/* eslint-disable no-unused-vars */
import "./form.styles.scss";
import { useState } from "react";
import validateInput from "./validators/input-validator.component";
import validateForm from "./validators/form-validator.component";

export const Form = ({ addValues }) => {
  const [bucketA, setBucketA] = useState();
  const [bucketB, setBucketB] = useState();
  const [bucketGoal, setBucketGoal] = useState();
  const [bucketState] = useState({ small: 0, large: 0 });
  const [error, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);

  /** HANDLE CHANGE */
  const handleChange = (e) => {
    const bucket = e.target.name;
    const error = validateInput(e.target.value);

    switch (bucket) {
      case "bucketA":
        setBucketA(Number(e.target.value));
        break;
      case "bucketB":
        setBucketB(Number(e.target.value));
        break;
      case "bucketGoal":
        setBucketGoal(Number(e.target.value));
        break;

      default:
    }

    if (error.length > 0) {
      setDisabled(true);
      setErrors({ [bucket]: error });
    } else {
      setErrors(null);
      setDisabled(false);
    }
  };

  /** CHECK MAX LENGTH */
  const maxLengthCheck = (val) => {
    if (val.target.value.length > val.target.maxLength) {
      val.target.value = val.target.value.slice(0, val.target.maxLength);
    }
  };

  /** ON SUBMIT */
  const onSubmit = (e) => {
    e.preventDefault();

    // form validation
    const error = validateForm(bucketA, bucketB, bucketGoal);

    if (error.length > 0) {
      setDisabled(true);
      setErrors({ bucketGoal: error });
      return;
    } else {
      addValues([bucketA, bucketB, bucketGoal]);

      // Find path
      const shortestPath = getShortestPath(bucketA, bucketB, bucketGoal);

      setDefaults();
      console.log("shortest path: ", shortestPath);
      //TODO: SET SHORTEST PATH TO USE IN DISPLAY
    }
  };

  const setDefaults = () => {
    setBucketA(null);
    setBucketB(null);
    setBucketGoal(null);
    setErrors(null);
  };

  const getShortestPath = (maxSmBucket, maxLgBucket, bucketGoal) => {
    /** Breadth-First Search: BFS will not lead to an infinite loop and finds the shortest possible path between the root node and the goal via other accessible nodes. */
    /** STEPS 
      - Step One: Fill the m litre jug and empty its contents into the n litre jug.
      - Step Two: If at any instant the m litre jug becomes empty fill it with water.
      - Step Three: If at any instant the n litre jug becomes full empty it.
      - Step Four: Repeat steps one, two, and three till any of the jugs among the n litre jug and the m litre jug contains exactly d litres of water.

    The time complexity of the solutions is usually O (m*n). */

    // FILL - fill bucket to capacity
    const fillBucket = (buckets, key = "large", max = maxLgBucket) => ({
      ...buckets,
      [key]: max,
    });

    // DUMP - set state back to 0
    const dumpBucket = (buckets, key = "large") => ({ ...buckets, [key]: 0 });

    // TRANSFER LARGE => SMALL
    const lgToSm = ({ large, small }) => {
      const quantityNeededToFillSmBucket = maxSmBucket - small;

      return {
        large:
          large > quantityNeededToFillSmBucket
            ? large - quantityNeededToFillSmBucket
            : 0,
        small:
          large > quantityNeededToFillSmBucket
            ? small + quantityNeededToFillSmBucket
            : small + large,
      };
    };

    // TRANSFER SMALL => LARGE
    const smToLg = ({ small, large }) => {
      const quantityNeededToFillLgBucket = maxLgBucket - large;

      return {
        large:
          small > quantityNeededToFillLgBucket
            ? (small = quantityNeededToFillLgBucket)
            : 0,
        small:
          small > quantityNeededToFillLgBucket
            ? large + quantityNeededToFillLgBucket
            : small + large,
      };
    };

    // Checks if new state already exists in the path
    const isPairRepeated = (path, { small, large }) =>
      !!path.find((x) => x.small === small && x.large === large);

    /** BEGIN CALCULATIONS */
    const queue = [];
    const path = [];

    path.push(bucketState); // Initial state of buckets (0, 0)
    queue.push(path); // Start queue with initial bucket state

    while (queue.length) {
      const lastPath = queue.shift(); // first element in queue is saved
      const lastState = lastPath[lastPath.length - 1];

      if (bucketGoal === lastState.large) return lastPath; // last pair = end search for shortest path

      // create set using the lastState
      const states = new Set([
        fillBucket(lastState), // fill large
        fillBucket(lastState, "small", maxSmBucket), // fill small
        lgToSm(lastState), // transfer lg to sm
        smToLg(lastState), // transfer sm to lg
        dumpBucket(lastState), // dump large bucket
        dumpBucket(lastState, "small"), // dump small bucket
      ]);

      // loop through states and check for repeated pairs
      // create the queue and return with shortest path
      for (let item of states) {
        if (!isPairRepeated(lastPath, item)) {
          const newPath = [...lastPath];
          newPath.push(item);
          queue.push(newPath);
        }
      }
    }

    console.log("queue after: ", queue);
    return null;
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <h1 className="form__title">🪣 Bucket Challenge 🪣</h1>
      <p>
        Given a lake of water, an oddly shaped <b>small</b> (Ex: 3 unit)
        container (A) and an oddly shaped <b>large</b> (Ex: 5 unit) container
        (B), find the most efficient steps to get the <b>goal</b> (Ex: 4 units)
        amount of water (C).
      </p>
      <div className="form__inputs">
        <label className="form__label">Bucket A</label>
        <input
          required
          className={`form__input ${error?.bucketA && "error__input"}`}
          type="text"
          name="bucketA"
          placeholder="Enter Bucket A value"
          maxLength="3"
          minLength="1"
          onChange={handleChange}
          onBlur={handleChange}
          onInput={maxLengthCheck}
          value={bucketA || ""}
        />
        {error?.bucketA && <p className="error__message">{error?.bucketA}</p>}

        <label className="form__label">Bucket B</label>
        <input
          required
          className={`form__input ${error?.bucketB && "error__input"}`}
          type="text"
          name="bucketB"
          placeholder="Enter Bucket B value"
          maxLength="3"
          minLength="1"
          onChange={handleChange}
          onBlur={handleChange}
          onFocus={handleChange}
          onInput={maxLengthCheck}
          value={bucketB || ""}
        />
        {error?.bucketB && <p className="error__message">{error?.bucketB}</p>}

        <label className="form__label">Bucket Goal Amount</label>
        <input
          required
          className={`form__input ${error?.bucketGoal && "error__input"}`}
          type="text"
          name="bucketGoal"
          placeholder="Enter goal value"
          maxLength="3"
          minLength="1"
          onChange={handleChange}
          onBlur={handleChange}
          onFocus={handleChange}
          onInput={maxLengthCheck}
          value={bucketGoal || ""}
        />
        {error?.bucketGoal && (
          <p className="error__message">{error?.bucketGoal}</p>
        )}
      </div>

      <button
        className="form__btn-submit"
        type="submit"
        title="Calculate"
        disabled={disabled}
      >
        Calculate
      </button>
    </form>
  );
};
