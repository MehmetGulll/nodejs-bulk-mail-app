import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Mails from "./pages/Mails";
import Categories from "./pages/Categories";
import Header from "./components/Header";
import { AuthProvider } from "./Context/AuthContext";

function AppContent() {
  const location = useLocation();

  return (
    <div className="flex flex-col bg-layoutBackground max-w-6xl mx-auto w-full">
      {location.pathname !== "/" && location.pathname !== "/register" && (
        <div className="mt-7">
          <Header />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/emails" element={<Mails />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
