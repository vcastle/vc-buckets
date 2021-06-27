import "./form.styles.scss";
import { useState } from "react";
import validate from "./validators/form-validator.component";

export const Form = ({ addValues }) => {
  const [bucketA, setBucketA] = useState();
  const [bucketB, setBucketB] = useState();
  const [bucketGoal, setBucketGoal] = useState(4);
  const [error, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);

  const handleChange = (e) => {
    const bucket = e.target.name;
    const error = validate(e.target.value);

    switch (bucket) {
      case "bucketA":
        setBucketA(Number(e.target.value));
        break;
      case "bucketB":
        setBucketB(Number(e.target.value));
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

  const maxLengthCheck = (val) => {
    if (val.target.value.length > val.target.maxLength) {
      val.target.value = val.target.value.slice(0, val.target.maxLength);
    }
  };

  const onSubmit = (e) => {
    addValues([bucketA, bucketB, bucketGoal]);
    e.preventDefault();

    // DO THE ALGO LOGIC
    calculate(bucketA, bucketB, bucketGoal);

    // Set Defaults
    setBucketA(null);
    setBucketB(null);
    setErrors(null);
  };

  const calculate = (a, b, c) => {
    console.log(a, b, c);
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <h1 className="form__title">🪣 Bucket Challenge 🪣</h1>
      <p>
        Given a lake of water, an oddly shaped 3 unit container (A) and an oddly
        shaped 5 unit container (B), find the most efficient steps to get 4
        units of water (C).
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

        <label className="form__label">Goal</label>
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
