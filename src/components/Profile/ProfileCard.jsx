import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const ProfileCard = ({ profile, email, setEmail, crystal, tuVi, role }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [emailInput, setEmailInput] = useState(email);
  const [showTuViForm, setShowTuViForm] = useState(false);
  const [tuViInput, setTuViInput] = useState(tuVi);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="md:flex">
        {/* Avatar */}
        <div className="md:w-1/3 p-6 flex flex-col items-center justify-center">
          <img
            src="https://placehold.co/200"
            alt="Avatar"
            className="rounded-full w-40 h-40 object-cover mb-4 border-4 border-blue-500"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Đổi ảnh đại diện
          </button>
        </div>

        {/* Info */}
        <div className="md:w-2/3 p-6">
          {/* Username */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Tên:{" "}
            <span className="text-blue-600">{profile.username}</span>
          </h2>

          {/* Email */}
          <div className="mb-4">
            <span className="font-semibold">Email:</span>
            <span className="text-gray-700 ml-2">{email}</span>
            <button
              className="ml-2 text-sm text-blue-500 hover:underline"
              onClick={() => setShowEmailForm(v => !v)}
            >
              Thay đổi
            </button>
          </div>

          {showEmailForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Thay đổi email</h3>
              <input
                type="email"
                className="w-full p-2 mb-2 border rounded"
                placeholder="Nhập email mới"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowEmailForm(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    setEmail(emailInput);
                    setShowEmailForm(false);
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="mb-4">
            <span className="font-semibold">Mật khẩu:</span>
            <button
              className="ml-2 text-sm text-blue-500 hover:underline"
              onClick={() => setShowPasswordForm(v => !v)}
            >
              Thay đổi
            </button>
          </div>

          {showPasswordForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Thay đổi mật khẩu</h3>
              <input
                type="password"
                className="w-full p-2 mb-2 border rounded"
                placeholder="Mật khẩu hiện tại"
              />
              <input
                type="password"
                className="w-full p-2 mb-2 border rounded"
                placeholder="Mật khẩu mới"
              />
              <input
                type="password"
                className="w-full p-2 mb-2 border rounded"
                placeholder="Nhập lại mật khẩu mới"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Hủy
                </button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Xác nhận
                </button>
              </div>
            </div>
          )}

          {/* Linh thạch */}
          <div className="flex items-center">
            <span className="font-semibold">Linh thạch:</span>
            <span className="ml-2 text-xl text-purple-600 font-bold flex items-center">
              <span>{crystal}</span>
              <img
                src="https://placehold.co/30x30"
                alt="Linh thạch"
                className="ml-1 w-6 h-6"
              />
            </span>
              <button onClick={() => navigate("/deposit")}>
                    Nạp thêm
                  </button>
          </div>

          {/* Tu vi */}
            <div className="mt-4 flex items-center">
              <span className="font-semibold">Tu vi:</span>
              <span className="ml-2 text-base text-green-700 font-bold">
                {tuVi}
              </span>
              {role === "admin" && (
                <button
                  className="ml-2 text-sm text-blue-500 hover:underline"
                  onClick={() => setShowTuViForm(v => !v)}
                >
                  Thay đổi
                </button>
              )}
            </div>


          {showTuViForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Thay đổi Tu Vi</h3>
              <input
                type="text"
                className="w-full p-2 mb-2 border rounded"
                placeholder="Nhập tu vi mới"
                value={tuViInput}
                onChange={e => setTuViInput(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowTuViForm(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    setTuVi(tuViInput);
                    setShowTuViForm(false);
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}

          {/* Role */}
          <div className="mt-2 flex items-center">
            <span className="font-semibold">Quyền:</span>
            <span className="ml-2 text-base text-blue-700 font-bold capitalize">
              {role}
            </span>
            {role === "admin" && (
              <button
                type="button"
                className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                onClick={() => navigate("/admin/users")}
              >
                Quản lý
              </button>
            )}
          </div>

          {/* Ngày đăng ký */}
          <div className="mt-4">
            <span className="font-semibold">Ngày đăng ký:</span>
            <span className="text-gray-700 ml-2">
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
