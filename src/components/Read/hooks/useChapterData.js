import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../config";

export const useChapterData = (slug, chapterParam) => {
  const [comicName, setComicName] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [allChapters, setAllChapters] = useState([]);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(-1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug || !chapterParam) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`);
        const data = await res.json();
        const comic = data.data?.item;

        if (!comic || !comic.chapters) throw new Error("Không tìm thấy truyện hoặc chương");

        setComicName(comic.name || "");
        setUpdatedAt(comic.updatedAt || "");

        // Flatten chapter list
        let chapters = [];
        comic.chapters.forEach((server) => {
          if (Array.isArray(server.server_data)) {
            chapters = chapters.concat(server.server_data);
          }
        });

        // Sort theo số chương (giảm dần)
        chapters.sort((a, b) => {
          const aNum = parseFloat(a.chapter_name.replace(/[^\d.]/g, "")) || 0;
          const bNum = parseFloat(b.chapter_name.replace(/[^\d.]/g, "")) || 0;
          return bNum - aNum;
        });

        setAllChapters(chapters);

        // Tìm vị trí chương hiện tại
        const normalizedParam = decodeURIComponent(chapterParam).replace(/\s+/g, " ").trim().toLowerCase();
        const idx = chapters.findIndex(
          (c) => c.chapter_name.replace(/\s+/g, " ").trim().toLowerCase() === normalizedParam
        );

        setCurrentChapterIdx(idx);
        if (idx === -1) throw new Error("Không tìm thấy chương này");

        // Fetch ảnh chương
        const chapterObj = chapters[idx];
        const chapterRes = await fetch(chapterObj.chapter_api_data);
        const chapterData = await chapterRes.json();

        const domain = chapterData.data?.domain_cdn;
        const path = chapterData.data?.item?.chapter_path;
        const files = chapterData.data?.item?.chapter_image ?? [];

        const imgs = files.map((f) => `${domain}/${path}/${f.image_file}`);
        setImages(imgs);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu chương.");
        console.error(err);
      }

      setLoading(false);
    };

    fetchData();
  }, [slug, chapterParam]);

  return {
    comicName,
    updatedAt,
    allChapters,
    currentChapterIdx,
    images,
    loading,
    error,
  };
};
