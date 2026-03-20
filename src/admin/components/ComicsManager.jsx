import React from "react";
import { API_BASE_URL } from "../../../config";

const ComicsManager = ({ comics, totalComics, page, totalPages, goToPage }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-[#2196f3]">
      Danh sách truyện (Tổng: {totalComics.toLocaleString()} truyện)
    </h2>
    {comics.length === 0 && (
      <p className="text-gray-500 text-lg">Không có truyện nào.</p>
    )}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {comics.map((item, idx) => (
        <div
          key={item._id || idx}
          className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 text-black block overflow-hidden border border-gray-300 hover:-translate-y-1 relative"
        >
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            <img
              src={
                item?.thumb_url
                  ? (item.thumb_url.startsWith("http")
                    ? item.thumb_url
                    : `https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`)
                  : "https://via.placeholder.com/150x220?text=No+Image"
              }
              alt={item?.name || item?.slug}
              className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200 border-b border-gray-300"
              loading="lazy"
            />
            {item.isHot && (
              <span className="absolute top-2 right-2 bg-gradient-to-r from-[#ff512f] to-[#f09819] text-xs text-white font-bold px-2 py-0.5 rounded shadow">
                HOT
              </span>
            )}
          </div>
          <div className="p-2 flex flex-col gap-1">
            <h3 className="text-base font-bold text-black group-hover:text-[#ffb300] line-clamp-2 min-h-[2.5em] leading-tight">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600">Slug: {item.slug}</p>
          </div>
        </div>
      ))}
    </div>
    {totalPages > 1 && (
      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        <button
          className="px-3 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
        >
          ←
        </button>

        {(() => {
          const maxShow = 2;
          const range = 1;
          let pages = [];
          for (let i = 1; i <= totalPages; i++) {
            if (
              i <= maxShow ||
              i > totalPages - maxShow ||
              (i >= page - range && i <= page + range)
            ) {
              pages.push(i);
            } else if (
              (i === maxShow + 1 && page - range > maxShow + 1) ||
              (i === totalPages - maxShow && page + range < totalPages - maxShow)
            ) {
              pages.push("...");
            }
          }
          return pages
            .reduce((arr, p) => {
              if (p === "..." && arr[arr.length - 1] === "...") return arr;
              arr.push(p);
              return arr;
            }, [])
            .map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  key={`page-${p}`}
                  className={`px-3 py-1 rounded border text-sm ${
                    page === p
                      ? "bg-[#ffb300] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              )
            );
        })()}
        <button
          className="px-3 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
        >
          →
        </button>
      </div>
    )}
  </div>
);

export default ComicsManager;
