import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const TopRanking = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopComics = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ratings/top/list`);
      const json = await res.json();
      console.log("API response:", json);

      if (Array.isArray(json.topComics)) {
        const sorted = json.topComics
          .map((item) => ({
            ...item,
            avgRating: Number(item.avgRating || 0),
            ratingCount: Number(item.ratingCount || 0),
          }))
          .sort((a, b) => {
            if (b.avgRating !== a.avgRating) {
              return b.avgRating - a.avgRating;
            }
            return b.ratingCount - a.ratingCount;
          })
          .slice(0, 5);

        setComics(sorted);
      } else {
        console.error("topComics không phải mảng:", json.topComics);
        setComics([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải top ranking:", err);
      setComics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopComics();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <h2 className="text-xl text-pink-500 font-bold mb-4">🔥 Top Truyện Được Đánh Giá Cao</h2>
      {loading ? (
        <div className="text-gray-500 text-sm">Đang tải...</div>
      ) : comics.length === 0 ? (
        <div className="text-center text-gray-400 py-4">Không có dữ liệu</div>
      ) : (
        <ul>
          {comics.map((item, idx) => (
            <li
              key={item.slug}
              className="flex items-center gap-2 py-3 border-b last:border-b-0"
            >
              <span className="text-lg font-bold text-[#ffb300] w-6 text-center">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <img
                src={`https://img.otruyenapi.com/uploads/comics/${item.slug}-thumb.jpg`}
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
                alt={item.name || "Truyện"}
                className="w-10 h-14 object-cover rounded"
              />

              <div className="flex-1">
                <Link
                  to={`/truyen/${item.slug}`}
                  className="font-semibold text-sm md:text-base text-[#2b1e4a] line-clamp-1 hover:underline"
                >
                  {item.name || "Tên truyện không có"}
                </Link>
                <div className="text-xs text-gray-500">
                  ⭐ {item.avgRating.toFixed(1)} điểm
                </div>
                <div className="text-xs text-gray-400">
                  {item.ratingCount} lượt đánh giá
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopRanking;
