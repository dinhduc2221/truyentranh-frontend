import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import TopRanking from "./TopRanking";
import { useFollowedComics } from "../Read/hooks/useFollowedComics";
import "../../../src/index.css";
import CalendarWidget from "./CalendarWidget";
import { API_BASE_URL } from "../../../config";

const Home = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [readingHistory, setReadingHistory] = useState([]);
  const [historyComics, setHistoryComics] = useState({});
  const [homeComments, setHomeComments] = useState([]);
  const { followedComics } = useFollowedComics({ user });

  const cdnDomain = "https://img.otruyenapi.com";

  // Load danh sách truyện
  useEffect(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    setPage(isNaN(p) || p < 1 ? 1 : p);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://otruyenapi.com/v1/api/danh-sach?type=truyen-moi&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        const items = data.data?.items || [];
        setComics(items);

        const pagination = data.data?.params?.pagination;
        const total = pagination
          ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)
          : 1;
        setTotalPages(total);
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi tải dữ liệu");
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/user/history`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setReadingHistory(data.readingHistory || []));
  }, [user]);

  useEffect(() => {
    if (!user?.token || !readingHistory.length) return;
    const uniqueSlugs = [...new Set(readingHistory.map((h) => h.slug))];
    Promise.all(
      uniqueSlugs.map((slug) =>
        fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
          .then((res) => res.json())
          .then((data) => ({
            slug,
            name: data.data?.item?.name || slug,
            thumb_url: data.data?.item?.thumb_url || "",
          }))
      )
    ).then((arr) => {
      const obj = {};
      arr.forEach((item) => {
        obj[item.slug] = item;
      });
      setHistoryComics(obj);
    });
  }, [user, readingHistory]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/comment`)
      .then((res) => res.json())
      .then((data) => {
        const comments = Array.isArray(data.comments) ? data.comments : [];
        setHomeComments(comments);
      })
      .catch(() => {
        setHomeComments([]);
      });
  }, []);

  const goToPage = (p) => setSearchParams({ page: p });

  if (loading)
    return (
      <div className="bg-[#222] min-h-screen flex items-center justify-center text-white text-xl">
        Đang tải...
      </div>
    );
  if (error)
    return (
      <div className="bg-[#222] min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16 px-4 mb-6">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            🌸 Chào mừng bạn đến với Vườn Truyện Rực Rỡ
          </h1>
          <p className="text-md md:text-lg mb-6">
            Nơi hội tụ muôn vàn câu chuyện thăng hoa cảm xúc, dẫn lối bạn phiêu du qua những trang giấy ảo diệu.
          </p>
          <Link
            to="/the-loai"
            className="inline-block bg-white text-purple-700 hover:bg-purple-100 font-semibold px-6 py-3 rounded transition"
          >
            Khám phá kho truyện
          </Link>
        </div>
      </div>

      <div className="w-full max-w-[1700px] mx-auto px-6 xl:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main */}
          <div className="lg:col-span-8">
            <section className="mb-12">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-blue-500 text-white p-2 rounded mr-2">
                  MỚI CẬP NHẬT
                </span>
                <span className="text-gray-700">Truyện mới nhất</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {comics.map((item) => {
                  const latestChapter =
                    item.chaptersLatest && item.chaptersLatest.length > 0
                      ? item.chaptersLatest[0].chapter_name
                      : null;

                  return (
                    <Link
                      key={item._id}
                      to={`/truyen/${item.slug}`}
                      className="group bg-white text-black rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="relative bg-gray-50">
                        <img
                          src={
                            item.thumb_url
                              ? `${cdnDomain}/uploads/comics/${item.thumb_url}`
                              : "/default-avatar.png"
                          }
                          alt={item.name}
                          className="w-full h-52 md:h-56 object-contain"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/55 to-transparent" />
                      </div>

                      <div className="p-3 space-y-1">
                        <h3 className="font-semibold text-[15px] leading-snug text-gray-900 truncate group-hover:text-purple-700 transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-gray-500">Chương mới</span>
                          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 truncate max-w-[68%]">
                            {latestChapter || "Đang cập nhật"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 lg:pl-10 lg:border-l lg:border-gray-200">
          <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-blue-500 text-white p-1 rounded mr-2">
                  Mộng Truyện
                </span>
                <span className="text-gray-700">Truyện của bạn</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Lịch sử đọc */}
                <div>
                  <div className="bg-white rounded-lg shadow p-4 h-full">
                    <h3 className="font-bold text-lg mb-3 text-purple-700">
                      Lịch sử đọc
                    </h3>
                    {readingHistory.length === 0 ? (
                      <div className="text-xs text-gray-500">
                        Bạn chưa đọc truyện nào.
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs text-gray-700">
                        {[...new Set(readingHistory.map((h) => h.slug))]
                          .slice(0, 5)
                          .map((slug) => {
                            const comic = historyComics[slug];
                            return (
                              <Link
                                key={slug}
                                to={`/truyen/${slug}`}
                                className="flex items-center gap-2 hover:bg-purple-50 p-2 rounded"
                              >
                                <img
                                  src={
                                    comic?.thumb_url
                                      ? `${cdnDomain}/uploads/comics/${comic.thumb_url}`
                                      : "/default-avatar.png"
                                  }
                                  alt={comic?.name}
                                  className="w-8 h-12 object-cover rounded border"
                                />
                                <span className="text-sm truncate">
                                  {comic?.name || slug}
                                </span>
                              </Link>
                            );
                          })}
                        {readingHistory.length > 5 && (
                          <Link
                            to="/profile"
                            className="block mt-2 text-xs font-semibold text-center text-purple-600 hover:underline"
                          >
                            Xem thêm...
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Truyện theo dõi */}
                <div>
                  <div className="bg-white rounded-lg shadow p-4 h-full">
                    <h3 className="font-bold text-lg mb-3 text-blue-700">
                      Truyện theo dõi
                    </h3>
                    {followedComics.length === 0 ? (
                      <p className="text-xs text-gray-500">
                        Bạn chưa theo dõi truyện nào.
                      </p>
                    ) : (
                      <div className="space-y-2 text-xs text-gray-700">
                        {followedComics.slice(0, 5).map((comic) => (
                          <Link
                            key={comic.slug}
                            to={`/truyen/${comic.slug}`}
                            className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
                          >
                            <img
                              src={comic.thumb_url}
                              alt={comic.name}
                              className="w-8 h-12 object-cover rounded border"
                            />
                            <div className="flex-1 truncate">
                              <div className="font-medium text-sm truncate">
                                {comic.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Chapter {comic.chap || "?"}
                              </div>
                            </div>
                          </Link>
                        ))}
                        {followedComics.length > 5 && (
                          <Link
                            to="/profile"
                            className="block mt-2 text-xs font-semibold text-center text-purple-600 hover:underline"
                          >
                            Xem thêm...
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>


            {/* Top Ranking */}
            <div className="w-full mb-6">
              <TopRanking comics={comics} />
            </div>

            {/* Lịch */}
            <div>
              <CalendarWidget />
            </div>

            {/* Bình luận mới nhất */}
            <div className="mt-6 bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-indigo-700">Bình luận mới nhất</h3>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {homeComments.length} bình luận
                </span>
              </div>

              {homeComments.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có bình luận nào.</p>
              ) : (
                <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
                  {homeComments.slice(0, 30).map((comment) => (
                    <div
                      key={comment.id}
                      className="p-2 rounded-md border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-800 truncate">
                          {comment.displayName || comment.User?.username || "Ẩn danh"}
                        </span>
                        <span className="text-[11px] text-gray-500 shrink-0">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString("vi-VN")
                            : ""}
                        </span>
                      </div>

                      <p className="text-xs text-gray-700 line-clamp-2">{comment.content}</p>

                      <Link
                        to={`/truyen/${comment.comicSlug}`}
                        className="inline-block mt-1 text-xs text-blue-600 hover:underline"
                      >
                        Xem truyện
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;