import React, { useState } from "react";
import "./App.scss";

import { Form } from "./form/form.component";
import { Buckets } from "./buckets/buckets.component";

function App() {
  const [bucketA, setBucketA] = useState();
  const [bucketB, setBucketB] = useState();
  const [formValue, setFormValues] = useState([]);

  const addValues = (val) => {
    let values = [...formValue, val];
    setFormValues(values);
  };

  return (
    <div className="grid">
      <Buckets
        bucketA={bucketA}
        onSetBucketA={setBucketA}
        bucketB={bucketB}
        onSetBucketB={setBucketB}
      ></Buckets>
      <Form addValues={addValues}></Form>
    </div>
  );
}

export default App;
