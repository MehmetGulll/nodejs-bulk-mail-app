import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Mails from "./pages/Mails";

import Header from "./components/Header";

import Categories from "./pages/Categories";

function App() {
  return (
    <Router>
      <div className="flex flex-col bg-layoutBackground max-w-6xl mx-auto w-full">
        <div className="mt-7">
          <Header />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/emails" element={<Mails />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
