// src/hooks/useReadingHistory.js
import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../../../../config";

export const useReadingHistory = ({ user, slug, chapter }) => {
  const [readingHistory, setReadingHistory] = useState([]);
  const [historyComics, setHistoryComics] = useState({});
  const lastSaved = useRef({ slug: null, chapter: null });

  // Gửi lịch sử đọc và lấy danh sách lịch sử
  useEffect(() => {
    if (!user?.token || !slug || !chapter) return;
    if (lastSaved.current.slug === slug && lastSaved.current.chapter === chapter) {
      return;
    }
    lastSaved.current = { slug, chapter };

    const saveAndFetchHistory = async () => {
      try {
        // Gửi lịch sử đọc
        await fetch(`${API_BASE_URL}/api/user/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ slug, chapter }),
        });

        // Lấy lịch sử đọc
        const res = await fetch(`${API_BASE_URL}/api/user/history`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) throw new Error("Lỗi khi lấy lịch sử đọc");
        const data = await res.json();
        setReadingHistory(data.readingHistory || []);
      } catch (err) {
        console.error("Lỗi khi tải lịch sử đọc:", err);
      }
    };

    saveAndFetchHistory();
  }, [user, slug, chapter]);

  // Lấy thông tin chi tiết (name, thumb_url) cho các truyện trong lịch sử
  useEffect(() => {
    if (!user?.token || !readingHistory.length) return;
    const uniqueSlugs = [...new Set(readingHistory.map((h) => h.slug))];
    Promise.all(
      uniqueSlugs.map((slug) =>
        fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
          .then((res) => {
            if (!res.ok) throw new Error(`Lỗi khi lấy thông tin truyện ${slug}`);
            return res.json();
          })
          .then((data) => {
            const thumbUrl = data.data?.item?.thumb_url;
            const fullThumbUrl = thumbUrl?.startsWith("http")
              ? thumbUrl
              : `https://img.otruyenapi.com/uploads/comics/${thumbUrl || "placeholder.jpg"}`;
            return {
              slug,
              name: data.data?.item?.name || slug,
              thumb_url: fullThumbUrl || "https://via.placeholder.com/120x180?text=No+Img",
            };
          })
          .catch((err) => {
            console.error(`Lỗi khi lấy thông tin truyện ${slug}:`, err);
            return { slug, name: slug, thumb_url: "https://via.placeholder.com/120x180?text=No+Img" };
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

  const isChapterRead = (slugToCheck, chapterName) => {
    const history = readingHistory.find((h) => h.slug === slugToCheck);
    if (!history) return false;

    const parseNum = (ch) => {
      const n = parseFloat(String(ch).replace(/[^\d.]/g, ""));
      return isNaN(n) ? 0 : n;
    };

    const currentNum = parseNum(chapterName);
    const savedNum = parseNum(history.chapter);

    return currentNum > 0 && savedNum > 0 && currentNum <= savedNum;
  };

  // Kết hợp readingHistory với historyComics để có name và thumb_url
  const enrichedHistory = readingHistory.map((item) => ({
    ...item,
    name: historyComics[item.slug]?.name || item.slug,
    thumb_url: historyComics[item.slug]?.thumb_url || "https://via.placeholder.com/120x180?text=No+Img",
  }));

  return {
    readingHistory: enrichedHistory,
    isChapterRead,
  };
};