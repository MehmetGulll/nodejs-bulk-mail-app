import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedName, setSelectedName] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/sendEmail', {name:selectedName})
      alert('Email sent successfully!');
    } catch (error) {
      console.log("Error", error);
      alert('Email sent failed',error);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl">Bulk Mail App</h1>
      <div className="mt-5">
        <div>Gönderilecek olan birim</div>
      </div>
      <div className="mt-2">
        <select className="border-2 border-slate-700 rounded-md px-5" value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
          <option value="belediye">Belediye</option>
          <option value="Bilcom">Bilcom</option>
          <option value="hukuk">Hukuk</option>
          <option value="tarim">Tarim</option>
        </select>
      </div>
      <div className="mt-5 border-2 px-8 border-slate-700 rounded-md px-5">
        <button onClick={handleSubmit}>Gönder</button>
      </div>
    </div>
  );
}

export default App;
