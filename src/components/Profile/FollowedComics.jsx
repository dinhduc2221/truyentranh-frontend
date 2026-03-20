import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const ITEMS_PER_PAGE = 30;

const FollowedComics = ({ comics }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(comics.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const paginatedComics = comics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div id="followed-tab">
      {comics.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Bạn chưa theo dõi truyện nào.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {paginatedComics.map((comic) => (
              <div
                key={comic.slug}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={
                      comic.thumb_url
                        ? comic.thumb_url.startsWith("http")
                          ? comic.thumb_url
                          : `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`
                        : "https://via.placeholder.com/600x400?text=No+Image"
                    }
                    alt={comic.name}
                    className="w-full h-48 object-cover"
                  />
                  <div
                    className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
                      comic.status === "Hoàn thành"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {comic.status || "Đang tiến hành"}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1 hover:text-blue-600 cursor-pointer">
                    <Link to={`/truyen/${comic.slug}`}>
                      {comic.name && comic.name.length > 30
                        ? comic.name.slice(0, 30) + "..."
                        : comic.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-xs mb-1">
                    Tác giả: {comic.author || "?"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">
                      Chương mới nhất:{" "}
                      <span className="font-semibold">{comic.chap || "?"}</span>
                    </span>
                    <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                      Hủy theo dõi
                    </button>
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

export default FollowedComics;
