import React, { useEffect, useState } from "react";
import "../../../src/index.css";
import Pagination from "./Pagination";
import { API_BASE_URL } from "../../../config";

const rainbowGradient = {
  background: "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const HomeComments = ({ comments = [], onAddComment, user }) => {
  const [content, setContent] = useState("");
  const [allComments, setAllComments] = useState(comments);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

  useEffect(() => {
    if (!Array.isArray(comments)) {
      setAllComments([]);
      return;
    }
    setAllComments(comments);
    setCurrentPage(1);
  }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const newComment = await onAddComment(content);
      setAllComments((prev) => [newComment, ...prev]);
      setContent("");
      setCurrentPage(1);
    } catch (err) {
      console.error("Lỗi gửi bình luận:", err);
      alert("Gửi bình luận thất bại!");
    }
  };

  const totalPages = Math.ceil(allComments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const currentComments = allComments.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="comment-textarea"
          rows={4}
          placeholder="Hãy chia sẻ cảm nghĩ của bạn..."
        />
        <button type="submit" className="comment-button">
          Gửi bình luận
        </button>
      </form>

      {/* Comments */}
      <div className="space-y-4">
        {currentComments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Chưa có bình luận nào.</p>
        ) : (
          currentComments
            .filter((c) => c && typeof c === "object")
            .map((comment) => (
              <div
                key={comment.id || Math.random()}
                className="flex gap-4 p-4 rounded-lg shadow border border-gray-100"
                style={{
                  background: "linear-gradient(to right, #f5e1ff, #ffe1f0)",
                }}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={
                        comment.User?.avatarUrl
                          ? comment.User.avatarUrl
                          : "https://placehold.co/48x48?text=User"
                      }
                      alt={comment.User?.username || "Ẩn danh"}
                      className="w-12 h-12 rounded-full border"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/48x48?text=User";
                      }}
                    />
                    {comment.User?.avatarFrame && (
                      <img
                        src={comment.User.avatarFrame}
                        alt=""
                        className="absolute inset-0 w-12 h-12 rounded-full pointer-events-none"
                      />
                    )}
                  </div>
                </div>

                {/* Nội dung */}
                <div className="flex-1">
                  {/* Tên + Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-semibold text-base"
                      style={{
                        color: "black",
                      }}
                    >
                      {comment.User?.username || "Ẩn danh"}
                    </span>
                    {comment.User?.badge && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "#fee2e2", 
                          color: "#b91c1c", 
                        }}
                      >
                        {comment.User.badge}
                      </span>
                    )}
                  </div>

                  {/* VIP */}
                  {comment.User?.vipLevel > 0 && (
                    <div
                      className="text-xs font-semibold"
                      style={rainbowGradient}
                    >
                      VIP cấp {comment.User.vipLevel}
                    </div>
                  )}

                  {/* Cảnh giới */}
                  <div
                    className="text-xs font-semibold"
                    style={rainbowGradient}
                  >
                    {comment.User?.tuVi || "Phàm Nhân"} -{" "}
                    {comment.User?.realm || "Phàm Nhân"}
                  </div>

                  {/* Nội dung comment */}
                  <p
                    className="mt-3 p-3 rounded border border-gray-300 text-sm text-black bg-white"
                  >
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default HomeComments;
