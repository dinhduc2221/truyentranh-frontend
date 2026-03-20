import React from "react";
import { API_BASE_URL } from "../../../config";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      {/* Nút Previous */}
      <button
        className="px-2 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        &lt;
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
        return pages.reduce((arr, p, idx) => {
          if (p === "..." && arr[arr.length - 1] === "...") return arr;
          arr.push(p);
          return arr;
        }, []).map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={`pagination-page-${p}`}
              className={`px-3 py-1 rounded border text-sm ${
                page === p
                  ? "bg-[#ffb300] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        );
      })()}

      {/* Nút Next */}
      <button
        className="px-2 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
