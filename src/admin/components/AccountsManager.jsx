import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

const AccountsManager = ({ handleRoleChange }) => {
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [depositHistory, setDepositHistory] = useState({});
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        
        const res = await axios.get(`${API_BASE_URL}/api/user/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleExpand = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    // Nếu chưa load depositHistory, gọi API
    if (!depositHistory[userId]) {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/deposit/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDepositHistory((prev) => ({
          ...prev,
          [userId]: res.data.deposits || [],
        }));
      } catch (err) {
        console.error("Lỗi khi tải lịch sử nạp:", err);
        setDepositHistory((prev) => ({ ...prev, [userId]: [] }));
      }
    }

    setExpandedUserId(userId);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#2196f3]">
        Quản lý tài khoản
      </h2>
      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-lg">Không có tài khoản nào.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <th className="border p-3 text-left">Tên tài khoản</th>
                <th className="border p-3 text-left">Linh thạch</th>
                <th className="border p-3 text-left">Thời gian tạo</th>
                <th className="border p-3 text-left">Quyền</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <React.Fragment key={user.id}>
                  <tr
                    className="hover:bg-blue-50 cursor-pointer transition"
                    onClick={() => toggleExpand(user.id)}
                  >
                    <td className="border p-3 font-medium text-gray-800">
                      {user.username}
                    </td>
                    <td className="border p-3 text-blue-600 font-semibold">
                      {user.linhThach || 0}
                    </td>
                    <td className="border p-3">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="border p-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="border p-1 rounded focus:ring-2 focus:ring-[#ffb300] bg-white"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                  {expandedUserId === user.id && (
                    <tr key={`${user.id}-expanded`}>
                      <td colSpan="4" className="border-t p-4 bg-gray-50">
                        {/* Thông tin User */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {Object.entries(user).map(([key, value]) => (
                            <div key={key} className="flex border-b py-1">
                              <div className="w-40 font-semibold text-gray-700 capitalize">
                                {key}
                              </div>
                              <div
                                className={`flex-1 text-gray-800 truncate ${
                                  key === "linhThach"
                                    ? "text-green-600 font-bold"
                                    : ""
                                }`}
                                title={String(value)}
                              >
                                {value === null || value === undefined || value === ""
                                  ? "Không có dữ liệu"
                                  : key === "createdAt" || key === "updatedAt"
                                  ? new Date(value).toLocaleString()
                                  : String(value)}
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Lịch sử nạp */}
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Lịch sử nạp linh thạch
                          </h4>
                          {depositHistory[user.id]?.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full border text-sm">
                                <thead>
                                  <tr className="bg-blue-100">
                                    <th className="border p-2">Ngày</th>
                                    <th className="border p-2">Số lượng LT</th>
                                    <th className="border p-2">Giá (VNĐ)</th>
                                    <th className="border p-2">Phương thức</th>
                                    <th className="border p-2">Trạng thái</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {depositHistory[user.id].map((d) => (
                                    <tr key={d.id}>
                                      <td className="border p-2">
                                        {new Date(d.createdAt).toLocaleString()}
                                      </td>
                                      <td className="border p-2">{d.amount}</td>
                                      <td className="border p-2">{d.price}</td>
                                      <td className="border p-2">{d.method}</td>
                                      <td
                                        className={`border p-2 ${
                                          d.status === "approved"
                                            ? "text-green-600"
                                            : d.status === "rejected"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                        }`}
                                      >
                                        {d.status === "approved"
                                          ? "Đã duyệt"
                                          : d.status === "rejected"
                                          ? "Đã từ chối"
                                          : "Chờ duyệt"}
                                      </td>

                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">
                              Không có giao dịch nạp.
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccountsManager;
