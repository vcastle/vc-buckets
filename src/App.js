import React, { useState } from "react";
import './App.scss';

import { Form } from './form/form.component';
import { Buckets } from './buckets/buckets.component';

function App() {
  const [bucketA, setBucketA] = useState('');
  const [bucketB, setBucketB] = useState('');

  const [formErrors, setFormErrors] = useState({});


  return (
    <div className="grid">  
     <Buckets></Buckets>
     <Form></Form>
    </div>
  );
}

export default App;
