import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/") // Backend server URL
      .then(res => setMessage(res.data))
      .catch(err => setMessage("Failed to connect to backend"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Frontend Vite App</h1>
      <p>{message || "Loading..."}</p>
    </div>
  );
}

export default App;
