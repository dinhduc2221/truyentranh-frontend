import React from "react";
import ChapterNav from "./ChapterNav";
import { API_BASE_URL } from "../../../config";

const StickyNav = ({
  slug,
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
}) => {
  return (
    <ChapterNav
      slug={slug}
      allChapters={allChapters}
      currentChapterIdx={currentChapterIdx}
      prevIdx={prevIdx}
      nextIdx={nextIdx}
      goToChapter={goToChapter}
      showChapterList={showChapterList}
      setShowChapterList={setShowChapterList}
      renderChapterList={renderChapterList}
      isFollowing={isFollowing}
      toggleFollow={toggleFollow}
      className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-white shadow-lg"
      style={{ minWidth: 320 }}
    />
  );
};

export default StickyNav;
