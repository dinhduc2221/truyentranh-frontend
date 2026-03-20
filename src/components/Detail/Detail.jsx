import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import ComicInfo from "./ComicInfo";
import ChapterList from "./ChapterList";
import ReadingHistory from "./ReadingHistory";
import TopRanking from "../Home/TopRanking";
import CommentSection from "../CommentSection";
import { API_BASE_URL } from "../../../config";

const Detail = ({ user }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [comic, setComic] = useState(null);
  const [comicStats, setComicStats] = useState({ views: 0, followers: 0, rating: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingHistory, setReadingHistory] = useState([]);
  const [historyComics, setHistoryComics] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  // Nếu chưa đăng nhập, chuyển login ngay khi mở trang
  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user?.token) return; // Chỉ chạy khi đã login

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch chi tiết truyện từ API oTruyen
        const resDetail = await fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`);
        if (!resDetail.ok) throw new Error("Lỗi khi tải chi tiết truyện");
        const detailData = await resDetail.json();
        if (cancelled) return;

        const loadedComic = detailData.data?.item || null;
        setComic(loadedComic);

        // 2. Gửi request tăng view và lấy thống kê
        const resView = await fetch(`${API_BASE_URL}/api/comic/view/${slug}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ name: loadedComic?.name || slug }),
        });
        if (!resView.ok) throw new Error("Lỗi khi tải thông tin thống kê");
        const viewData = await resView.json();
        if (viewData.success) {
          setComicStats({
            views: viewData.view_count || 0,
            followers: viewData.followers || 0,
            rating: viewData.rating || 0,
          });
        } else {
          throw new Error("Dữ liệu thống kê không hợp lệ");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Đã xảy ra lỗi");
          console.error("Chi tiết lỗi:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [slug, user]);

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/user/history`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi tải lịch sử đọc");
        return res.json();
      })
      .then((data) => {
        setReadingHistory(Array.isArray(data.readingHistory) ? data.readingHistory : []);
      })
      .catch((err) => {
        console.error("Lỗi khi tải lịch sử đọc:", err);
      });
  }, [user]);

  useEffect(() => {
    if (!user?.token || !readingHistory.length) return;
    const uniqueSlugs = [...new Set(readingHistory.map((h) => h.slug))];
    Promise.all(
      uniqueSlugs.map((slug) =>
        fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
          .then((res) => {
            if (!res.ok) throw new Error(`Lỗi khi tải chi tiết truyện ${slug}`);
            return res.json();
          })
          .then((data) => ({
            slug,
            name: data.data?.item?.name || slug,
            thumb_url: data.data?.item?.thumb_url || "",
          }))
          .catch((err) => {
            console.error(err);
            return { slug, name: slug, thumb_url: "" };
          })
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
    if (!user?.token || !slug) return setIsFollowing(false);
    fetch(`${API_BASE_URL}/api/user/is-following/${slug}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi kiểm tra trạng thái theo dõi");
        return res.json();
      })
      .then((data) => setIsFollowing(!!data.isFollowing))
      .catch((err) => {
        console.error("Lỗi khi kiểm tra trạng thái theo dõi:", err);
        setIsFollowing(false);
      });
  }, [user, slug]);

  const handleClickChapter = async (chapterName) => {
    if (viewLoading || !comic?.name) return;
    if (!user?.token) {
      navigate("/login");
      return;
    }
    setViewLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/comic/view/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: comic.name }),
      });
      window.location.href = `/doc/${comic.slug}/${encodeURIComponent(chapterName)}`;
    } catch (error) {
      console.error("Lỗi khi tăng view:", error);
    } finally {
      setViewLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user?.token) return;
    setFollowLoading(true);
    const url = isFollowing
      ? `${API_BASE_URL}/api/user/unfollow`
      : `${API_BASE_URL}/api/user/follow`;
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ slug }),
      });
      setIsFollowing((f) => !f);
    } catch (err) {
      console.error("Lỗi khi theo dõi/bỏ theo dõi:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  const isChapterRead = (slug, chapterName) => {
    const history = readingHistory.find((h) => h.slug === slug);
    if (!history) return false;
    const parseNum = (ch) => {
      const n = parseFloat(String(ch).replace(/[^\d.]/g, ""));
      return isNaN(n) ? 0 : n;
    };
    const currentNum = parseNum(chapterName);
    const savedNum = parseNum(history.chapter);
    return currentNum > 0 && savedNum > 0 && currentNum <= savedNum;
  };

  if (!user?.token) return null; // Không render gì khi chưa login

  if (loading) return <div className="p-4">Đang tải chi tiết truyện...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!comic) return <div className="p-4">Không tìm thấy truyện.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 bg-white text-black min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Breadcrumbs
            links={[
              { label: "Trang chủ", to: "/" },
              { label: "Thể loại", to: "/the-loai" },
              {},
            ]}
            current={comic?.name || ""}
          />
          <ComicInfo
            comic={comic}
            comicStats={comicStats}
            isFollowing={isFollowing}
            followLoading={followLoading}
            user={user}
            handleFollow={handleFollow}
          />
          <ChapterList
            chapters={comic?.chapters || []}
            slug={slug}
            user={user}
            readingHistory={readingHistory}
            handleClickChapter={handleClickChapter}
            isChapterRead={isChapterRead}
          />
        </div>
        <div className="w-full md:w-80 flex-shrink-0 mt-8 md:mt-0">
          <ReadingHistory
            user={user}
            readingHistory={readingHistory}
            historyComics={historyComics}
          />
          <TopRanking />
        </div>
      </div>
      <div className="w-full">
        <CommentSection comicSlug={slug} user={user} />
      </div>
    </div>
  );
};

export default Detail;
