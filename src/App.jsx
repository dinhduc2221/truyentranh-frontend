import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./components/AppRoutes";
import { API_BASE_URL } from "../config";

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem("user");
    let parsed = null;
    try {
      parsed = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
    } catch (e) {
      parsed = null;
    }
    return parsed;
  });

  useEffect(() => {
    fetch("https://otruyenapi.com/v1/api/the-loai")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
      });
  }, []);

  const handleLogin = ({ token, username, role }) => {
    const newUser = { token, username, role };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const hideLayoutRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isHideLayout = hideLayoutRoutes.includes(window.location.pathname);

  return (
    <Router>
      <div className={`min-h-screen ${isHideLayout ? "" : "flex flex-col"}`}>
        {!isHideLayout && (
          <Navbar
            categories={categories}
            onSelectCategory={setSelectedCategory}
            user={user}
            onLogout={handleLogout}
          />
        )}

        <main className="flex-1 bg-white">
          <AppRoutes
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </main>

        {!isHideLayout && <Footer />}
      </div>
    </Router>
  );
}

export default App;
