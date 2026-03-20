import React from "react";
import { API_BASE_URL } from "../../../config";

const TabNavigation = ({ tab, setTab }) => (
  <div className="flex gap-2 mb-6">
    <button
      className={`px-4 py-2 rounded ${
        tab === "followed"
          ? "bg-[#2196f3] text-white"
          : "bg-gray-100 text-gray-700"
      }`}
      onClick={() => setTab("followed")}
    >
      Theo dõi
    </button>
    <button
      className={`px-4 py-2 rounded ${
        tab === "history"
          ? "bg-[#ffb300] text-white"
          : "bg-gray-100 text-gray-700"
      }`}
      onClick={() => setTab("history")}
    >
      Lịch sử đọc
    </button>
    <button
      className={`px-4 py-2 rounded ${
        tab === "comments"
          ? "bg-[#4caf50] text-white"
          : "bg-gray-100 text-gray-700"
      }`}
      onClick={() => setTab("comments")}
    >
      Bình luận
    </button>
  </div>
);

export default TabNavigation;
