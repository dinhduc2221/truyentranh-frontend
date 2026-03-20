import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

export const useLatestComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/comment`);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Lỗi khi lấy bình luận:", err);
        setError("Không thể tải bình luận.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  return { comments, loading, error };
};
