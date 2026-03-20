import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { API_BASE_URL } from "../../config";

const RaiTing = ({ comicSlug, user }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const userId = user?.id;

  const fetchRatings = async (showLoader = false) => {
    try {
      if (showLoader && !hasLoadedOnce) setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/ratings/${comicSlug}`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      const ratings = data.ratings || [];
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        const avg = sum / ratings.length;
        setAverageRating(avg);
        setRatingCount(ratings.length);
        if (user) {
          const my = ratings.find((r) => r.userId === user.id);
          if (my) setRating(my.rating);
        }
      } else {
        setAverageRating(0);
        setRatingCount(0);
      }
      setHasLoadedOnce(true);
    } catch (err) {
      console.error("Lỗi khi tải ratings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings(true);
  }, [comicSlug, userId]);

const submitRating = async (value) => {
  if (!user) {
    alert("Bạn cần đăng nhập để đánh giá!");
    return;
  }
  try {
    setSubmitting(true);
    const res = await fetch(`${API_BASE_URL}/api/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ comicSlug, rating: value }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Lỗi không xác định");
    }
    setRating(value);
    await fetchRatings(false);
  } catch (err) {
    alert(`Không thể gửi đánh giá: ${err.message}`);
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="flex flex-col items-center">
      {loading ? (
        <div className="text-gray-500 text-sm">Đang tải đánh giá...</div>
      ) : (
        <>
          <div className="flex mb-2">
            {[...Array(5)].map((_, index) => {
              const value = index + 1;
              return (
                <label key={value}>
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    disabled={submitting}
                    onClick={() => submitRating(value)}
                    className="hidden"
                  />
                  <FaStar
                    size={32}
                    className="cursor-pointer transition-colors"
                    color={
                      value <= (hover || rating)
                        ? "#ffc107"
                        : "#e4e5e9"
                    }
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              );
            })}
          </div>
          <div className="text-sm text-gray-600">
            Điểm trung bình:{" "}
            <span className="font-semibold">
              {averageRating.toFixed(1)} / 5
            </span>{" "}
            ({ratingCount} lượt đánh giá)
          </div>
        </>
      )}
    </div>
  );
};

export default RaiTing;
