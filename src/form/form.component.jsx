import "./form.styles.scss";

export const Form = () => (
  <div className="form">
    <h1 className="form__title">🪣 Bucket Challenge 🪣</h1>

    <div className="form__inputs">
      <input
        required
        className="form__input"
        type="input"
        name="bucketA"
        placeholder="Enter Bucket A value"
      />

      <input
        required
        className="form__input"
        type="input"
        name="bucketB"
        placeholder="Enter Bucket B value"
        // TODO: add validation
      />
    </div>

    <button
      className="form__btn-submit"
      type="submit"
      title="Calculate"
      // TODO: add validation
      // onClick={this.handleDarkMode}
    >
      Calculate
    </button>
  </div>
);
