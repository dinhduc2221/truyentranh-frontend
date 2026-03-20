import React from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const ComicInfo = ({
  comic,
  comicStats,
  isFollowing,
  followLoading,
  user,
  handleFollow,
}) => {
  const cdnDomain = "https://img.otruyenapi.com";
  const thumb = comic.thumb_url
    ? comic.thumb_url.startsWith("http")
      ? comic.thumb_url
      : `${cdnDomain}/uploads/comics/${comic.thumb_url}`
    : `${cdnDomain}/Uploads/comics/no-image.png`;

  // Lấy chương đầu tiên và cuối cùng
  const firstChapter =
    comic.chapters?.[0]?.server_data?.[0]?.chapter_name || "";
  const lastServerData = comic.chapters?.[0]?.server_data;
  const lastChapter =
    lastServerData?.[lastServerData.length - 1]?.chapter_name || "";

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-white rounded shadow p-4">
      <div>
        <img
          src={thumb}
          alt={comic.name}
          className="w-44 h-64 object-cover rounded shadow border"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${cdnDomain}/Uploads/comics/no-image.png`;
          }}
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#222] mb-1">{comic.name}</h1>

        <div className="text-xs text-gray-500 mb-1">
          [Cập nhật lúc:{" "}
          {comic.updatedAt
            ? new Date(comic.updatedAt).toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "-"}
          {" - "}
          {comic.updatedAt
            ? new Date(comic.updatedAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : ""}
          ]
        </div>

        <div className="flex flex-wrap gap-3 text-sm mb-1">
          <div>
            <span className="font-semibold">Tác giả:</span>{" "}
            {Array.isArray(comic.author)
              ? comic.author.join(", ")
              : comic.author || "Không rõ"}
          </div>
          <div>
            <span className="font-semibold">Tình trạng:</span>{" "}
            {comic.status || "?"}
          </div>
          <div>
            <span className="font-semibold">Lượt xem:</span>{" "}
            {comicStats.views.toLocaleString()}
          </div>
        </div>

        <div>
          <span className="font-semibold block mb-1">Thể loại:</span>
          <div className="flex flex-wrap gap-2">
            {comic.category?.length ? (
              comic.category.map((cat, i) => (
                <Link
                  key={cat.id || cat.slug || i}
                  to={`/the-loai/${cat.slug}`}
                  className="px-2 py-1 bg-[#f3f4f6] rounded text-sm text-[#374151] hover:bg-[#e5e7eb] border"
                >
                  {cat.name}
                </Link>
              ))
            ) : (
              <span className="text-gray-500">Không có thể loại</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold">Xếp hạng:</span>
          <span className="text-yellow-500 font-bold">{comicStats.rating}</span>
          <span className="text-xs text-gray-500">
            ({comic.rate_count || 0} lượt đánh giá)
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <button
            className={`px-3 py-1 rounded text-xs font-semibold ${
              isFollowing
                ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            onClick={handleFollow}
            disabled={followLoading || !user}
          >
            {followLoading
              ? "Đang xử lý..."
              : isFollowing
              ? "Đã theo dõi"
              : "Theo dõi"}
          </button>
          <span className="text-[#ff4e8a] font-bold">
            {comicStats.followers.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">Người Đã Theo Dõi</span>
        </div>

        <div className="flex gap-2 mb-2">
          {firstChapter ? (
            <Link
              to={`/doc/${comic.slug}/${firstChapter}`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-semibold"
            >
              Đọc từ đầu
            </Link>
          ) : (
            <span className="text-gray-500 text-xs">Chưa có chương</span>
          )}
          {lastChapter && (
            <Link
              to={`/doc/${comic.slug}/${lastChapter}`}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-semibold"
            >
              Đọc mới nhất
            </Link>
          )}
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-xs font-semibold">
            Đọc tiếp &gt;
          </button>
        </div>

        <div className="mb-2">
          <span className="font-semibold">Mô tả:</span>{" "}
          <span
            className="text-gray-800"
            dangerouslySetInnerHTML={{
              __html: comic.content || "Không có mô tả.",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ComicInfo;
