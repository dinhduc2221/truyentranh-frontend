// src/pages/DepositPage.jsx
import React, { useState, useEffect } from "react";
import { createDeposit } from "../Money/api/deposit";
import { getCurrentUser } from "../Money/api/user";
import { createCardDeposit } from "../Money/api/cardDeposit";
import { API_BASE_URL } from "../../../config";

export default function DepositPage() {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("Người đọc");
  const [cardSerial, setCardSerial] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [cardType, setCardType] = useState("viettel");


  const packageList = [
    { amount: 500, price: 10000, discount: "0%" },
    { amount: 1000, price: 20000, discount: "0%" },
    { amount: 2000, price: 50000, discount: "5%" },
    { amount: 5000, price: 100000, discount: "10%" },
    { amount: 10000, price: 200000, discount: "15%" },
  ];

  const paymentMethods = [
    { label: "Ví điện tử Momo" },
    { label: "Chuyển khoản ngân hàng" },
    { label: "ZaloPay" },
    { label: "Thẻ quốc tế" },
    { label: "Nạp bằng thẻ cào" },
  ];

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData?.token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });

    const data = await res.json();
    setCurrentBalance(data.user.linhThach || 0);
    setUsername(data.user.username || "Người đọc");
  } catch (error) {
    console.error(error);
    alert("Không thể lấy thông tin tài khoản. Vui lòng đăng nhập lại.");
  }
};


  const handleSelectPackage = (pkg) => {
    setSelectedAmount(pkg.amount);
    setSelectedPrice(pkg.price);
    setCustomAmount("");
  };

  const handleQuickSelect = (amount, price) => {
    setSelectedAmount(amount);
    setSelectedPrice(price);
    setCustomAmount("");
  };

  const handleCustomSelect = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      setSelectedAmount(amount);
      setSelectedPrice(amount * 20);
    } else {
      alert("Vui lòng nhập số lượng hợp lệ");
    }
  };

    const handleConfirm = async () => {
      if (selectedAmount === 0) {
        alert("Vui lòng chọn gói Linh Thạch");
        return;
      }
      if (!selectedMethod) {
        alert("Vui lòng chọn phương thức thanh toán");
        return;
      }

      // Nếu chọn nạp card
      if (selectedMethod === "Nạp bằng thẻ cào") {
        if (!cardSerial || !cardCode) {
          alert("Vui lòng nhập đầy đủ thông tin thẻ cào");
          return;
        }
        try {
          await createCardDeposit({
            amount: selectedPrice,
            price: selectedPrice,
            cardType,
            cardSerial,
            cardCode,
            token: JSON.parse(localStorage.getItem("user"))?.token,
          });
          setShowModal(true);
          setSelectedAmount(0);
          setSelectedPrice(0);
          setSelectedMethod(null);
          setCardSerial("");
          setCardCode("");
          setCustomAmount("");
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
        return;
      }

      let backendMethod = "bank";
      if (selectedMethod.includes("Momo")) backendMethod = "momo";
      else if (selectedMethod.includes("ZaloPay")) backendMethod = "zalopay";

      try {
        await createDeposit({
          amount: selectedAmount,
          method: backendMethod,
          token: JSON.parse(localStorage.getItem("user"))?.token,
        });
        await fetchBalance();

        setShowModal(true);
        setSelectedAmount(0);
        setSelectedPrice(0);
        setSelectedMethod(null);
        setCustomAmount("");
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    };


  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://placehold.co/150x50"
              alt="Logo"
              className="h-10 mr-2"
            />
            <h1 className="text-xl font-bold text-gray-800">Web Truyện</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Xin chào, <strong>{username}</strong>
            </span>
            <div>
              <img
                src="https://placehold.co/40x40"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-800 mb-2">
              NẠP LINH THẠCH
            </h2>
            <p className="text-gray-600">
              Linh Thạch là đơn vị tiền tệ để mở khóa chương VIP và ủng hộ tác giả
            </p>
          </div>

          {/* Current Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-1 text-center">
                SỐ DƯ HIỆN TẠI
              </h3>
              <div className="text-3xl font-bold text-purple-700 text-center">
                {currentBalance.toLocaleString()}{" "}
                <span className="text-base">Linh Thạch</span>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                TÙY CHỌN NHANH
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {packageList.map((pkg) => (
                  <button
                    key={pkg.amount}
                    onClick={() => handleQuickSelect(pkg.amount, pkg.price)}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-3 rounded-md"
                  >
                    {pkg.amount.toLocaleString()} LT
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Packages */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              GÓI LINH THẠCH
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packageList.map((pkg) => (
                <div
                  key={pkg.amount}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`border rounded-lg p-4 hover:shadow-lg cursor-pointer ${
                    selectedAmount === pkg.amount ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  <div className="text-center mb-3">
                    <span className="text-2xl font-bold text-purple-700">
                      {pkg.amount.toLocaleString()}
                    </span>{" "}
                    <span>Linh Thạch</span>
                  </div>
                  <div className="text-center mb-3">
                    <span className="text-3xl font-bold text-purple-800">
                      {pkg.price.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="text-center text-sm text-green-600 mb-3">
                    Tiết kiệm {pkg.discount}
                  </div>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md">
                    Chọn gói
                  </button>
                </div>
              ))}

              {/* Custom */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-center mb-3 text-2xl font-bold text-purple-700">
                  Tùy chỉnh
                </div>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Số lượng Linh Thạch"
                  className="w-full text-black mb-3 border p-2 rounded"
                />
                <div className="text-center text-xl font-bold text-purple-800 mb-3">
                  {(customAmount ? customAmount * 20 : 0).toLocaleString()}đ
                </div>
                <button
                  onClick={handleCustomSelect}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md"
                >
                  Chọn gói
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white text-black rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              PHƯƠNG THỨC THANH TOÁN
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.label}
                  onClick={() => setSelectedMethod(method.label)}
                  className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer hover:bg-purple-50 ${
                    selectedMethod === method.label ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  <span className="text-sm font-medium">{method.label}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedMethod === "Nạp bằng thẻ cào" && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin thẻ cào</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhà mạng</label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    className="w-full border rounded p-2 text-black"
                  >
                    <option value="viettel">Viettel</option>
                    <option value="vinaphone">Vinaphone</option>
                    <option value="mobifone">Mobifone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số serial</label>
                  <input
                    type="text"
                    value={cardSerial}
                    onChange={(e) => setCardSerial(e.target.value)}
                    className="w-full border rounded p-2 text-black"
                    placeholder="Nhập số serial"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã thẻ</label>
                  <input
                    type="text"
                    value={cardCode}
                    onChange={(e) => setCardCode(e.target.value)}
                    className="w-full border rounded p-2 text-black"
                    placeholder="Nhập mã thẻ"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Mệnh giá: <strong>{selectedPrice.toLocaleString()}đ</strong> - phải khớp với thẻ
              </p>
            </div>
          )}


          {/* Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              THÔNG TIN GIAO DỊCH
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600 mb-1">Số lượng Linh Thạch:</p>
                <p className="text-xl font-bold text-purple-700">
                  {selectedAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Thành tiền:</p>
                <p className="text-xl font-bold text-purple-700">
                  {selectedPrice.toLocaleString()}đ
                </p>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md text-lg font-semibold animate-pulse"
            >
              XÁC NHẬN NẠP TIỀN
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          Web Truyện - Nơi thỏa mãn đam mê đọc truyện của bạn
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-center mb-2">
              Yêu cầu nạp đã được gửi!
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Vui lòng chờ admin duyệt giao dịch của bạn.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
