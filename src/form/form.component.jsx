/* eslint-disable no-unused-vars */
import "./form.styles.scss";
import { useState } from "react";
import { Display } from "../display/display.component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schemaValidation = yup.object().shape({
  bucketA: yup
    .number()
    .typeError("Numeric value required")
    .integer()
    .required()
    .positive()
    .min(1)
    .max(100),
  bucketB: yup
    .number()
    .typeError("Numeric value required")
    .integer()
    .required()
    .positive()
    .min(1)
    .max(100),
  bucketGoal: yup
    .number()
    .typeError("Numeric value required")
    .integer()
    .required()
    .positive()
    .min(1)
    .max(100)
    .when("bucketB", (bucketB, bucketGoal) => {
      return bucketB ? bucketGoal.max(bucketB) : bucketGoal.min(1);
    })
    .test({
      name: "test-is-odd", // Your custom error id
      test: function () {
        const { bucketA, bucketB, bucketGoal } = this.parent; // Access the object data, here this.parent contains your data
        if (bucketA % 2 === 0 && bucketGoal % 2 !== 0 && bucketB % 2 === 0) {
          return this.createError({
            message: `Two even buckets cannot result of an odd numbered goal value`, // Error message for the user
            path: `bucketGoal`, // The object path where you want show the error
          });
        }
        return true; // True for no error
      },
    }),
});

export const Form = ({ addValues }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
    resolver: yupResolver(schemaValidation),
  });

  const [bucketState] = useState({ small: 0, large: 0, action: "Initial" });
  const [shortestPath, setShortestPath] = useState();
  const [disabled, setDisabled] = useState(false);

  const onSubmit = (data) => {
    const { bucketA, bucketB, bucketGoal } = data;

    addValues(data);
    getShortestPath(bucketA, bucketB, bucketGoal);

    reset();
    setDisabled(true);
  };

  const getShortestPath = (maxSmBucket, maxLgBucket, bucketGoal) => {
    /** Breadth-First Search: BFS will not lead to an infinite loop and finds the shortest possible path between the root node and the goal via other accessible nodes. */
    /** STEPS: 
      - Step One: Fill the large bucket and transfer its contents into the small bucket.
      - Step Two: If large bucket becomes empty fill it with water.
      - Step Three: If the small bucket becomes full empty it.
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
      const lastPath = queue.shift(); // remove first element in queue and return it - changes the length of queue
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
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <label className="form__label">Bucket A</label>
          <input
            className={`form__input ${errors?.bucketA && "error__input"}`}
            type="number"
            name="bucketA"
            placeholder="Enter Bucket A value"
            min="1"
            max="100"
            {...register("bucketA")}
          />

          {errors.bucketA && (
            <p className="error__message">{errors.bucketA?.message}</p>
          )}

          <label className="form__label">Bucket B</label>
          <input
            className={`form__input ${errors?.bucketB && "error__input"}`}
            type="number"
            name="bucketB"
            placeholder="Enter Bucket B value"
            maxLength="3"
            minLength="1"
            min="1"
            {...register("bucketB")}
          />
          {errors.bucketB && (
            <p className="error__message">{errors.bucketB?.message}</p>
          )}

          <label className="form__label">Bucket Goal Amount</label>
          <input
            className={`form__input ${errors?.bucketGoal && "error__input"}`}
            type="number"
            name="bucketGoal"
            placeholder="Enter goal value"
            maxLength="3"
            minLength="1"
            {...register("bucketGoal")}
          />
          {errors.bucketGoal && (
            <p className="error__message">{errors.bucketGoal?.message}</p>
          )}

          <button
            className="form__btn-submit"
            type="submit"
            title="Calculate"
            disabled={!isDirty || !isValid}
          >
            Calculate
          </button>
        </form>

        {shortestPath && <Display shortestPath={shortestPath}></Display>}
      </div>
    </div>
  );
};
