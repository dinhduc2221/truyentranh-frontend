import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 20;

const Comments = ({ user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/comment/user`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user?.token) return null;

  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);

  const paginatedComments = comments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="font-bold text-lg mb-4 text-[#2196f3]">
        📝 Lịch sử bình luận
      </div>
      {loading ? (
        <div className="text-gray-500 text-sm">Đang tải...</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-gray-500">
          Bạn chưa bình luận truyện nào.
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {paginatedComments.map((c) => (
              <li
                key={c.id}
                className="flex flex-col gap-1 border-b pb-3 last:border-b-0"
              >
                <div>
                  <span className="font-semibold text-base">
                    {c.comicSlug}
                  </span>
                  <span className="ml-2 text-gray-500 text-sm">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <div className="text-gray-700 text-sm">{c.content}</div>
                <Link
                  to={`/truyen/${c.comicSlug}`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Xem truyện
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
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

export default Comments;
