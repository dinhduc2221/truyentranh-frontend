// src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import AccountsManager from "./components/AccountsManager";
import ComicsManager from "./components/ComicsManager";
import MessagesManager from "./components/MessagesManager";
import DepositStats from "./components/DepositStats";
import { API_BASE_URL } from "../../config";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  const [users, setUsers] = useState([]);
  const [comics, setComics] = useState([]);
  const [comments, setComments] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComics, setTotalComics] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();


  const getToken = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser).token : null;
  };

  // Đọc trang từ URL
  useEffect(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    setPage(isNaN(p) || p < 1 ? 1 : p);
  }, [searchParams]);

  // Fetch dữ liệu theo tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          setError("Vui lòng đăng nhập với quyền admin");
          navigate("/login");
          return;
        }

        switch (activeTab) {
          case "accounts":
            {
              const res = await axios.get(`${API_BASE_URL}/api/user/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setUsers(res.data.users || []);
            }
            break;
          case "comics":
            {
              const res = await axios.get(
                `https://otruyenapi.com/v1/api/danh-sach?type=truyen-moi&page=${page}`
              );
              setComics(res.data.data?.items || []);
              const pagination = res.data.data?.params?.pagination;
              setTotalPages(
                pagination
                  ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)
                  : 1
              );
              setTotalComics(pagination?.totalItems || 0);
            }
            break;
          case "messages":
            {
              const res = await axios.get(`${API_BASE_URL}/api/comment`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setComments(res.data.comments || []);
            }
            break;
          case "deposits":
            {
              const res = await axios.get(`${API_BASE_URL}/api/deposit`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setDeposits(res.data.deposits || []);
            }
            break;
          default:
            break;
        }
      } catch (err) {
        console.error("Lỗi fetch dữ liệu:", err);
        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu.");
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTab, page, navigate]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = getToken();
      if (!token) {
        setError("Vui lòng đăng nhập để thay đổi quyền");
        return;
      }
      await axios.post(
        `${API_BASE_URL}/api/user/role`,
        { userId, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      setError(null);
    } catch (err) {
      console.error("Lỗi cập nhật quyền:", err);
      setError(err.response?.data?.message || "Lỗi khi cập nhật quyền");
    }
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) {
      setSearchParams({ page: p });
    }
  };

  return (
<div className="min-h-screen bg-gray-100 text-black font-sans">
  <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
    {/* Sidebar */}
    <aside className="w-full md:w-64 bg-gray-800 text-white p-4 flex-shrink-0">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Quản lý Admin</h2>
      <ul className="grid grid-cols-2 md:block gap-2">
        {[
          { key: "accounts", label: "Tài khoản" },
          { key: "messages", label: "Bình luận" },
          { key: "comics", label: "Danh sách truyện" },
          { key: "deposits", label: "Nạp Linh Thạch" },
        ].map((tab) => (
          <li
            key={tab.key}
            className={`p-3 rounded-lg cursor-pointer text-sm text-center md:text-left transition-colors ${
              activeTab === tab.key
                ? "bg-[#2196f3] text-white"
                : "hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </aside>

    {/* Main content */}
    <main className="flex-1 p-4 md:p-6 w-full overflow-x-auto">
      {loading && (
        <p className="text-gray-500 text-lg">Đang tải dữ liệu...</p>
      )}
      {error && (
        <p className="text-red-500 text-lg mb-4">{error}</p>
      )}

      {activeTab === "accounts" && (
        <AccountsManager
          users={users}
          loading={loading}
          error={error}
          handleRoleChange={handleRoleChange}
        />
      )}
      {activeTab === "messages" && (
        <MessagesManager comments={comments} />
      )}
      {activeTab === "comics" && (
        <ComicsManager
          comics={comics}
          totalComics={totalComics}
          page={page}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      )}
      {activeTab === "deposits" && (
        <DepositStats
          deposits={deposits}
          refresh={() => setActiveTab("deposits")}
        />
      )}
    </main>
  </div>
</div>

  );
};

export default AdminDashboard;
