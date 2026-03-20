import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const user = {
          token: data.token,
          username: payload.username,
          role: payload.role
        };
        onLogin(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/", { replace: true });

      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 font-['Inter']">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        {/* Phần banner */}
        <div className="bg-gradient-to-br from-indigo-500 to-violet-500 h-40 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h2 className="text-2xl font-bold mb-2">Chào mừng trở lại!</h2>
            <p className="text-sm opacity-90">Đăng nhập để tiếp tục với tài khoản của bạn</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Đăng nhập</h2>

          {error && (
            <div className="mb-3 text-sm text-red-500">{error}</div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-black border focus:outline-none focus:ring-2 focus:ring-indigo-950"
                placeholder="Tên đăng nhập"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-black border focus:outline-none focus:ring-2 focus:ring-offset-indigo-950"
                placeholder="••••••••"
              />
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded" />
                  <label className="ml-2 text-sm text-gray-600">Ghi nhớ tôi</label>
                </div>
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-indigo-600 hover:underline"
              >
                Đăng ký ngay
              </button>
            </div>
          </form>

          {/* Hoặc đăng nhập với */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <img src="https://placehold.co/20x20" alt="Google" className="w-5 h-5 mr-2" />
                Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <img src="https://placehold.co/20x20" alt="Facebook" className="w-5 h-5 mr-2" />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
