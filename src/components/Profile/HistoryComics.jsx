import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const ITEMS_PER_PAGE = 30;

const HistoryComics = ({ history }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const paginatedHistory = history.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div id="history-tab">
      {history.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Bạn chưa đọc truyện nào.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {paginatedHistory.map((item, idx) => (
              <div
                key={item.slug + idx}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={
                      item.thumb_url
                        ? item.thumb_url.startsWith("http")
                          ? item.thumb_url
                          : `https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`
                        : "https://via.placeholder.com/600x400?text=No+Image"
                    }
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1 hover:text-blue-600 cursor-pointer">
                    <Link to={`/truyen/${item.slug}`}>
                      {item.name && item.name.length > 30
                        ? item.name.slice(0, 10) + "..."
                        : item.name}
                    </Link>
                  </h3>
                  <div className="text-gray-600 text-xs mb-1">
                    Chương đã đọc: {item.chapter || "?"}
                  </div>
                  <div className="text-xs text-gray-400">
                    Cập nhật:{" "}
                    {item.updatedAt
                      ? new Date(item.updatedAt).toLocaleString()
                      : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                ← Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    page === currentPage
                      ? "bg-indigo-600 text-white font-bold"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryComics;
