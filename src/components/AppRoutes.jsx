import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Search from "./Search";
import Detail from "./Detail/Detail";
import Read from "./Read/Read";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
import CategoryPage from "./CategoryPage";
import ProfileContainer from "./Profile/ProfileContainer";
import AdminUserManager from "../admin/AdminDashboard";
import DepositPage from "../components/Money/DepositPage";
import { API_BASE_URL } from "../../config";

// Trang demo
const Hot = () => <div className="p-4">Truyện Hot (đang phát triển)</div>;
const Full = () => <div className="p-4">Truyện Full (đang phát triển)</div>;

const AppRoutes = ({
  user,
  handleLogin,
  handleLogout,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => (
  <Routes>
    <Route path="/login" element={<Login onLogin={handleLogin} />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/deposit" element={<DepositPage />} />
    <Route
      path="/"
      element={
        <Home
          selectedCategory={selectedCategory}
          categories={categories}
          onSelectCategory={setSelectedCategory}
          user={user}
        />
      }
    />
    <Route
      path="/the-loai"
      element={<CategoryPage categories={categories} />}
    />
    <Route
      path="/the-loai/:slug"
      element={<CategoryPage categories={categories} />}
    />
    <Route path="/hot" element={<Hot />} />
    <Route path="/full" element={<Full />} />
    <Route path="/search" element={<Search />} />
    <Route path="/truyen/:slug" element={<Detail user={user} />} />
    <Route path="/doc/:slug/:chapter" element={<Read user={user} />} />
    <Route
      path="/profile"
      element={<ProfileContainer user={user} onLogout={handleLogout} />}
    />
    <Route
      path="/admin/users"
      element={<AdminUserManager user={user} />}
    />
  </Routes>
);

export default AppRoutes;
