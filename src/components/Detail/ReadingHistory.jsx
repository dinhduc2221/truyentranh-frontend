import React from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const ReadingHistory = ({ user, readingHistory, historyComics }) => (
  <div className="bg-white border rounded shadow p-4 mb-6">
    <div className="font-bold text-base mb-2 text-[#2196f3]">Lịch sử đọc truyện</div>
    {user ? (
      readingHistory.length === 0 ? (
        <div className="text-xs text-gray-500">Bạn chưa đọc truyện nào.</div>
      ) : (
        <ul className="text-xs text-gray-800 space-y-2">
          {[...new Set(readingHistory.map((h) => h.slug))]
            .slice(0, 5)
            .map((slug, idx) => {
              const comic = historyComics[slug];
              return (
                <li key={slug} className="flex items-center gap-2">
                  <Link to={`/truyen/${slug}`}>
                    <img
                      src={
                        comic?.thumb_url
                          ? comic.thumb_url.startsWith("http")
                            ? comic.thumb_url
                            : `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`
                          : "https://via.placeholder.com/40x56?text=No+Img"
                      }
                      alt={comic?.name || slug}
                      className="w-8 h-12 object-cover rounded border"
                    />
                  </Link>
                  <Link
                    to={`/truyen/${slug}`}
                    className="font-semibold hover:underline text-sm line-clamp-1"
                  >
                    {comic?.name || slug}
                  </Link>
                </li>
              );
            })}
        </ul>
      )
    ) : (
      <div className="text-xs text-gray-500">Đăng nhập để lưu lịch sử đọc truyện.</div>
    )}
  </div>
);

export default ReadingHistory;