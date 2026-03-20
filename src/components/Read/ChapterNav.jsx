import React from "react";
import { API_BASE_URL } from "../../../config";

const ChapterNav = ({
  allChapters,
  currentChapterIdx,
  prevIdx,
  nextIdx,
  goToChapter,
  showChapterList,
  setShowChapterList,
  renderChapterList,
  isFollowing,
  toggleFollow,
  onToggleSidebar,
  dropdownPlacement = "down",
  className = "",
  style = {},
}) => {
const isDropdownUp = dropdownPlacement === "up";
return (
<div
  className={`bg-gradient-to-r from-[#ffffff] to-[#ffffff] w-full shadow ${className}`}
  style={style}
>
  <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2">
    {/* Nút menu */}
    <button
      onClick={onToggleSidebar}
      className="p-2 rounded bg-blue-300 hover:bg-gray-700/20 text-black lg:hidden"
      title="Mở menu"
    >
      ☰
    </button>

    {/* Điều hướng chương */}
    <div className="flex items-center gap-2">
      {/* Chương trước */}
      <button
        className="p-2 rounded bg-white/20 text-black hover:bg-white/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
        title={prevIdx !== -1 ? `Chương ${allChapters[prevIdx]?.chapter_name}` : "Không có chương trước"}
        disabled={prevIdx === -1}
        onClick={() => goToChapter(prevIdx)}
      >
        ⬅
      </button>

      {/* Tên chương hiện tại */}
      <div className="relative">
        <button
          className="px-4 py-2 rounded bg-white/10 border border-white/30 text-black font-semibold flex items-center gap-1 hover:bg-white/20 transition"
          onClick={() => setShowChapterList((v) => !v)}
        >
          Chương {allChapters[currentChapterIdx]?.chapter_name || "?"}
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className={`transition-transform ${showChapterList ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {showChapterList && (
          <div
            className={
              isDropdownUp
                ? "fixed left-2 right-2 bottom-[76px] z-50 sm:absolute sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:bottom-full sm:mb-2 sm:w-[520px] sm:max-w-[92vw]"
                : "absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 w-[360px] max-w-[92vw] sm:w-[520px]"
            }
          >
            {renderChapterList()}
          </div>
        )}
      </div>

      {/* Chương sau */}
      <button
        className="p-2 rounded bg-white/20 text-black hover:bg-white/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
        title={nextIdx !== -1 ? `Chương ${allChapters[nextIdx]?.chapter_name}` : "Không có chương tiếp theo"}
        disabled={nextIdx === -1}
        onClick={() => goToChapter(nextIdx)}
      >
        ➡
      </button>
    </div>

    {/* Theo dõi */}
    <button
      onClick={toggleFollow}
      className={`px-3 py-2 rounded font-semibold flex items-center gap-1 text-sm transition ${
        isFollowing
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-yellow-500 hover:bg-yellow-600 text-white"
      }`}
    >
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
          2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81
          4.5 2.09C13.09 3.81 14.76 3 16.5
          3 19.58 3 22 5.42 22 8.5c0
          3.78-3.4 6.86-8.55 11.54L12
          21.35z" />
      </svg>
      {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
    </button>
  </div>
</div>

);

};

export default ChapterNav;
