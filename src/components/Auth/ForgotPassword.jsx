import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("🎉 Liên kết khôi phục đã được gửi đến email của bạn!");
        setEmail("");
      } else {
        setError(data.message || "Không thể gửi liên kết khôi phục");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setError("Lỗi kết nối server");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 font-['Inter']">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-br from-indigo-500 to-violet-500 h-40 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h2 className="text-2xl font-bold mb-2">Không thể đăng nhập?</h2>
            <p className="text-sm opacity-90">Đừng lo, chúng tôi sẽ giúp bạn lấy lại mật khẩu</p>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quên mật khẩu</h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <div className="mb-4 text-sm text-gray-600">
            Vui lòng nhập email để nhận liên kết khôi phục mật khẩu
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border form-input focus:outline-none focus:ring-1 text-black"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition"
            >
              {loading ? "Đang gửi..." : "Gửi liên kết khôi phục"}
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

export default ForgotPassword;
