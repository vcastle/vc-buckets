import React, { useState } from "react";
import "./App.scss";

import { Form } from "./form/form.component";

function App() {
  const [formValue, setFormValues] = useState([]);

  const addValues = (val) => {
    let values = [...formValue, val];
    setFormValues(values);
  };

  return (
    <div className="grid">
      <Form addValues={addValues}></Form>
    </div>
  );
}

export default App;
