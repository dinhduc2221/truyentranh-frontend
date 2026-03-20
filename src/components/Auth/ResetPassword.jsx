import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Thiếu token khôi phục mật khẩu.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("🎉 Mật khẩu đã được đặt lại thành công!");
        setPassword("");
        setConfirm("");
      } else {
        setError(data.message || "Không thể đặt lại mật khẩu.");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setError("Lỗi kết nối server.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 font-['Inter']">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-br from-indigo-500 to-violet-500 h-40 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h2 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h2>
            <p className="text-sm opacity-90">Tạo mật khẩu mới cho tài khoản của bạn</p>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tạo mật khẩu mới</h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border form-input focus:outline-none focus:ring-1 text-black"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Mật khẩu tối thiểu 8 ký tự</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border form-input focus:outline-none focus:ring-1 text-black"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition"
            >
              {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:underline"
            >
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
