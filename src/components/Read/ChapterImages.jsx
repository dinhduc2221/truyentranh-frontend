import React from "react";
import { API_BASE_URL } from "../../../config";

const ChapterImages = ({ images, loading, error }) => {
  if (loading) {
    return (
      <div className="text-gray-500 py-8 text-lg text-center">
        Đang tải ảnh chương...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 py-8 text-lg text-center">
        {error}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-gray-500 py-8 text-lg text-center">
        Không có ảnh cho chương này.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Trang ${idx + 1}`}
          className="w-full max-w-3xl rounded-lg shadow-md"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ))}
    </div>
  );
};

export default ChapterImages;
