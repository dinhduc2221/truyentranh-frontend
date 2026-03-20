// src/hooks/useFollowedComics.js
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

export const useFollowedComics = ({ user }) => {
  const [followedComics, setFollowedComics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.token) {
      setFollowedComics([]);
      return;
    }

    const fetchFollowedComics = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy danh sách slug truyện theo dõi
        const followedRes = await axios.get(`${API_BASE_URL}/api/user/followed`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const comicSlugs = followedRes.data.followedComics || [];

        // Lấy thông tin chi tiết cho từng truyện
        const comicPromises = comicSlugs.map((slug) =>
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
        );

        const comics = await Promise.all(comicPromises);
        setFollowedComics(comics);
      } catch (err) {
        setError("Không thể tải danh sách truyện theo dõi.");
        console.error("Lỗi API followed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedComics();
  }, [user]);

  return { followedComics, loading, error };
};