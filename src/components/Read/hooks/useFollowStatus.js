import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

export const useFollowStatus = ({ user, slug }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra trạng thái theo dõi khi component mount hoặc slug thay đổi
  useEffect(() => {
    if (!user?.token) return;

    fetch(`${API_BASE_URL}/api/user/is-following/${slug}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setIsFollowing(data.isFollowing))
      .catch((err) => {
        console.error("Lỗi khi kiểm tra theo dõi:", err);
      });
  }, [user, slug]);

  // Toggle follow/unfollow
  const toggleFollow = async () => {
    if (!user?.token) {
      navigate("/login");
      return;
    }
    try {
      const endpoint = isFollowing ? "/unfollow" : "/follow";
      const res = await axios.post(
        `${API_BASE_URL}/api/user${endpoint}`,
        { slug },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log("Follow API response:", res.data);
      // Gọi lại API lấy danh sách theo dõi để kiểm tra
      const followedRes = await fetch(`${API_BASE_URL}/api/user/followed`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const followedData = await followedRes.json();
      console.log("Followed comics after update:", followedData);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Lỗi khi thay đổi trạng thái theo dõi:", err);
    }
  };

  return { isFollowing, toggleFollow };
};
