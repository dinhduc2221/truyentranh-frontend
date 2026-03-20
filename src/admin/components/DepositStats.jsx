import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../../../config";

const DepositStats = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchDeposits = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const res = await axios.get(`${API_BASE_URL}/api/deposit`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeposits(res.data.deposits || []);
    } catch (err) {
      console.error('Lỗi khi tải nạp:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Bạn chắc chắn muốn ${action === 'approve' ? 'DUYỆT' : 'TỪ CHỐI'} yêu cầu này?`)) {
      return;
    }
    try {
      setProcessingId(id);
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await axios.post(`${API_BASE_URL}/api/deposit/${action}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDeposits();
    } catch (err) {
      console.error(`Lỗi khi ${action}:`, err);
      alert(`Lỗi khi ${action}: ${err.response?.data?.message || err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p>Đang tải thống kê nạp...</p>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-2">Thống kê nạp Linh Thạch</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Người dùng</th>
              <th className="p-2 border">Số lượng Linh Thạch</th>
              <th className="p-2 border">Số tiền (VNĐ)</th>
              <th className="p-2 border">Phương thức</th>
              <th className="p-2 border">Loại thẻ</th>
              <th className="p-2 border">Seri thẻ</th>
              <th className="p-2 border">Mã thẻ</th>
              <th className="p-2 border">Trạng thái</th>
              <th className="p-2 border">Ngày tạo</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((d) => (
              <tr key={d.id}>
                <td className="p-2 border">{d.User?.username}</td>
                <td className="p-2 border text-right">{d.amount}</td>
                <td className="p-2 border text-right">
                  {d.price ? d.price.toLocaleString() : '0'}
                </td>
                <td className="p-2 border">{d.method === 'card' ? 'Thẻ cào' : d.method}</td>
                <td className="p-2 border">{d.cardType || '-'}</td>
                <td className="p-2 border">{d.cardSerial || '-'}</td>
                <td className="p-2 border">{d.cardCode || '-'}</td>
                <td className="p-2 border">
                  {d.status === 'pending'
                    ? 'Chờ duyệt'
                    : d.status === 'approved'
                    ? 'Đã duyệt'
                    : 'Đã từ chối'}
                </td>
                <td className="p-2 border">
                  {new Date(d.createdAt).toLocaleString()}
                </td>
                <td className="p-2 border">
                  {d.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(d.id, 'approve')}
                        disabled={processingId === d.id}
                        className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
                      >
                        {processingId === d.id ? 'Đang duyệt...' : 'Duyệt'}
                      </button>
                      <button
                        onClick={() => handleAction(d.id, 'reject')}
                        disabled={processingId === d.id}
                        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        {processingId === d.id ? 'Đang từ chối...' : 'Từ chối'}
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">
                      {d.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepositStats;
