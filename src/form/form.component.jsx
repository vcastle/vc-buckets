/* eslint-disable no-unused-vars */
import "./form.styles.scss";
import { useState } from "react";

import validateInput from "./validators/input-validator.component";
import validateForm from "./validators/form-validator.component";
import { Display } from "../display/display.component";

export const Form = ({ addValues }) => {
  const [bucketA, setBucketA] = useState();
  const [bucketB, setBucketB] = useState();
  const [bucketGoal, setBucketGoal] = useState();
  const [bucketState] = useState({ small: 0, large: 0, action: "Initial" });
  const [shortestPath, setShortestPath] = useState();
  const [errors, setErrors] = useState({});
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
      getShortestPath(bucketA, bucketB, bucketGoal);

      setDefaults();
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
      - Step One: Fill the large bucket and transfer its contents into the small bucket.
      - Step Two: If at any instant large bucket becomes empty fill it with water.
      - Step Three: If at any instant the small bucket becomes full empty it.
      - Step Four: Repeat steps one, two, and three until any of the buckets contains exactly the goal amount of water. */

    const fillBucket = (buckets, key = "large", max = maxLgBucket) => ({
      ...buckets,
      [key]: max,
      action: "Fill",
    });

    const dumpBucket = (buckets, key = "large") => ({
      ...buckets,
      [key]: 0,
      action: "Empty",
    });

    const lgToSm = ({ large, small }) => {
      const quantityNeededToFillSmall = maxSmBucket - small;

      return {
        large:
          large > quantityNeededToFillSmall
            ? large - quantityNeededToFillSmall
            : 0,
        small:
          large > quantityNeededToFillSmall
            ? small + quantityNeededToFillSmall
            : small + large,
        action: "Transfer Large to Small",
      };
    };

    const smToLg = ({ large, small }) => {
      const quantityNeededToFillLarge = maxLgBucket - large;

      return {
        large:
          small > quantityNeededToFillLarge
            ? small - quantityNeededToFillLarge
            : 0,
        small:
          small > quantityNeededToFillLarge
            ? large + quantityNeededToFillLarge
            : small + large,
        action: "Transfer Small to Large",
      };
    };

    const isRepeated = (path, { small, large }) =>
      !!path.find((x) => x.small === small && x.large === large);

    const queue = [];
    const path = [];

    path.push(bucketState);
    queue.push(path);

    while (queue.length) {
      const lastPath = queue.shift();
      const lastState = lastPath[lastPath.length - 1];

      if (bucketGoal === lastState.large) return setShortestPath(lastPath);

      const states = new Set([
        fillBucket(lastState),
        fillBucket(lastState, "small", maxSmBucket),
        lgToSm(lastState),
        smToLg(lastState),
        dumpBucket(lastState),
        dumpBucket(lastState, "small"),
      ]);

      for (let item of states) {
        if (!isRepeated(lastPath, item)) {
          const newPath = [...lastPath];
          newPath.push(item);
          queue.push(newPath);
        }
      }
    }

    return null;
  };

  return (
    <div className="side-bar">
      <div className="side-bar__card">
        <h1 className="side-bar__title">🪣 Bucket Challenge 🪣</h1>
        <p className="side-bar__description">
          Given a lake of water, an oddly shaped <b>small</b> (Ex: 3 unit)
          container (A) and an oddly shaped <b>large</b> (Ex: 5 unit) container
          (B), find the most efficient steps to get the <b>goal</b> (Ex: 4
          units) amount of water (C).
        </p>
        <form className="form" onSubmit={onSubmit}>
          <label className="form__label">Bucket A</label>
          <input
            className={`form__input ${errors?.bucketA && "error__input"}`}
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
          {errors?.bucketA && (
            <p className="error__message">{errors?.bucketA}</p>
          )}

          <label className="form__label">Bucket B</label>
          <input
            className={`form__input ${errors?.bucketB && "error__input"}`}
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
          {errors?.bucketB && (
            <p className="error__message">{errors?.bucketB}</p>
          )}

          <label className="form__label">Bucket Goal Amount</label>
          <input
            className={`form__input ${errors?.bucketGoal && "error__input"}`}
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
          {errors?.bucketGoal && (
            <p className="error__message">{errors?.bucketGoal}</p>
          )}

          <button
            className="form__btn-submit"
            type="submit"
            title="Calculate"
            disabled={disabled}
          >
            Calculate
          </button>
        </form>

        {shortestPath && <Display shortestPath={shortestPath}></Display>}
      </div>
    </div>
  );
};
