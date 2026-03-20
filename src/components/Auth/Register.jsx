import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          tuVi: "Phàm Nhân",
          role: "member",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("🎉 Đăng ký thành công! Bạn có thể đăng nhập.");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirm("");
      } else {
        setError(data.message || "Đăng ký thất bại");
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
            <h2 className="text-2xl font-bold mb-2">Bắt đầu hành trình!</h2>
            <p className="text-sm opacity-90">
              Tạo tài khoản để truy cập các tính năng độc quyền
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Đăng ký tài khoản
          </h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Tài khoản
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border form-input focus:outline-none focus:ring-1 text-black"
                placeholder="NguyenVanA"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
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

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border form-input focus:outline-none focus:ring-1 text-black"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mật khẩu tối thiểu 8 ký tự
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 text-sm text-gray-600"
              >
                Tôi đồng ý với{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-indigo-600 hover:underline"
              >
                Đăng nhập ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
