import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  console.log(query);
  return (
    <div className="SearchContainer">
      <input type="text" onChange={(e) => handleChange(e)} />
    </div>
  );
}

export default App;
