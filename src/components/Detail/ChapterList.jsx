import React, { useRef, useState } from "react";

const ChapterList = ({ chapters, slug, user, readingHistory, handleClickChapter, isChapterRead }) => {
  const chapterData = chapters?.[0]?.server_data || [];
  const [chapterQuery, setChapterQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [searchError, setSearchError] = useState("");
  const listRef = useRef(null);
  const chapterRefs = useRef({});

  const normalizeChapter = (value) =>
    String(value || "")
      .toLowerCase()
      .replace("chapter", "")
      .trim();

  const handleFindChapter = (e) => {
    e.preventDefault();

    const query = normalizeChapter(chapterQuery);
    if (!query) {
      setSearchError("Nhập số chapter cần tìm");
      return;
    }

    const foundIndex = chapterData.findIndex(
      (chap) => normalizeChapter(chap.chapter_name) === query
    );

    if (foundIndex === -1) {
      setSearchError(`Không tìm thấy chapter ${chapterQuery}`);
      setHighlightedIndex(null);
      return;
    }

    setSearchError("");
    setHighlightedIndex(foundIndex);

    const chapterEl = chapterRefs.current[foundIndex];
    const containerEl = listRef.current;

    if (chapterEl && containerEl) {
      // Scroll inside the chapter list container so the matched chapter is centered.
      const containerRect = containerEl.getBoundingClientRect();
      const chapterRect = chapterEl.getBoundingClientRect();
      const chapterTopInContainer = chapterRect.top - containerRect.top + containerEl.scrollTop;
      const targetTop =
        chapterTopInContainer - containerEl.clientHeight / 2 + chapterEl.clientHeight / 2;

      containerEl.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-6 bg-white rounded shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg text-[#222]">Danh sách chương</span>
          <span className="text-xs text-gray-500">({chapterData.length || 0} chương)</span>
        </div>

        <form onSubmit={handleFindChapter} className="flex items-center gap-2">
          <input
            type="text"
            value={chapterQuery}
            onChange={(e) => setChapterQuery(e.target.value)}
            placeholder="Tìm chap, ví dụ 1000"
            className="w-48 md:w-56 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Tìm
          </button>
        </form>
      </div>
      {searchError && <div className="mb-2 text-xs text-red-500">{searchError}</div>}

      <div ref={listRef} className="max-h-[520px] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {chapterData.map((chap, idx) => {
            const read = user && isChapterRead(slug, chap.chapter_name);

            return (
              <button
                key={chap.chapter_name || idx}
                ref={(el) => {
                  chapterRefs.current[idx] = el;
                }}
                onClick={() => handleClickChapter(chap.chapter_name)}
                className={`text-left px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                  idx === highlightedIndex
                    ? "ring-2 ring-red-500 border-red-500"
                    : ""
                } ${
                  read
                    ? "bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100"
                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                }`}
                title={`Chapter ${chap.chapter_name}`}
              >
                <span className="block truncate">Chapter {chap.chapter_name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChapterList;