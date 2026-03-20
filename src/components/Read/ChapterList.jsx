import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";

const ChapterList = forwardRef(
  (
    {
      allChapters,
      currentChapterIdx,
      goToChapter,
      isChapterRead,
      slug,
      user,
      className = "",
      onSelect,
    },
    ref
  ) => {
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const listScrollRef = useRef(null);
    const currentChapterRef = useRef(null);

    const normalizedMap = useMemo(
      () =>
        allChapters.map((chap) =>
          String(chap.chapter_name || "")
            .toLowerCase()
            .replace("chapter", "")
            .trim()
        ),
      [allChapters]
    );

    const jumpToChapter = (e) => {
      e.preventDefault();
      const normalizedQuery = query.toLowerCase().replace("chapter", "").trim();

      if (!normalizedQuery) {
        setError("Nhập số chap cần tìm");
        return;
      }

      const foundIdx = normalizedMap.findIndex((v) => v === normalizedQuery);
      if (foundIdx === -1) {
        setError(`Không thấy chap ${query}`);
        return;
      }

      setError("");
      goToChapter(foundIdx);
      if (onSelect) onSelect();
    };

    useEffect(() => {
      // When the list opens, center the currently reading chapter for quick navigation.
      const container = listScrollRef.current;
      const currentEl = currentChapterRef.current;
      if (!container || !currentEl) return;

      const containerRect = container.getBoundingClientRect();
      const itemRect = currentEl.getBoundingClientRect();
      const itemTop = itemRect.top - containerRect.top + container.scrollTop;
      const targetTop = itemTop - container.clientHeight / 2 + currentEl.clientHeight / 2;

      container.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    }, [currentChapterIdx, allChapters.length]);

    return (
      <div
        ref={ref}
        className={`bg-white border border-gray-200 rounded-lg shadow-lg w-full ${className}`}
      >
        <div className="p-3 border-b border-gray-100">
          <form onSubmit={jumpToChapter} className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm chap, ví dụ 1000"
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Tìm
            </button>
          </form>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div ref={listScrollRef} className="p-3 max-h-[340px] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {allChapters.map((chap, idx) => (
            <button
              key={chap.chapter_name}
              ref={idx === currentChapterIdx ? currentChapterRef : null}
              onClick={() => {
                goToChapter(idx);
                if (onSelect) onSelect();
              }}
              className={`px-2.5 py-2 rounded-lg text-sm border transition text-left leading-tight ${
                idx === currentChapterIdx
                  ? "bg-[#ffb300] text-white"
                  : isChapterRead(slug, chap.chapter_name)
                  ? "bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100"
                  : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              }`}
            >
              <span className="block truncate">{chap.chapter_name}</span>
              {user && isChapterRead(slug, chap.chapter_name) && (
                <span className="block text-[10px] font-semibold text-pink-600">
                  Đã đọc
                </span>
              )}
            </button>
          ))}
          </div>
        </div>
      </div>
    );
  }
);

export default ChapterList;
