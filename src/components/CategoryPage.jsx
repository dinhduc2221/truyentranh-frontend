import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const sortOptions = [
  { label: "Ngày cập nhật", value: "updated" },
  { label: "Tên A-Z", value: "name" },
  { label: "Số chapter", value: "chapter" },
];

const statusOptions = [
  { label: "Tất cả", value: "" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Đang tiến hành", value: "ongoing" },
];

const CategoryPage = () => {
  const { slug } = useParams();
  const [comics, setComics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("updated");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const panelRef = useRef(null);
  const cdnDomain = "https://img.otruyenapi.com";
    console.log("Tổng số trang:", totalPages);

  const currentCategory = categories.find(cat => cat.slug === slug);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowCategoryPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lấy thể loại sidebar
  useEffect(() => {
    fetch("https://otruyenapi.com/v1/api/the-loai/")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.data?.items) ? data.data.items : [];
        setCategories(list.filter(cat => !!cat.slug));
      });
  }, []);

  // Đồng bộ page với url (?page=)
  useEffect(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    setPage(isNaN(p) || p < 1 ? 1 : p);
  }, [searchParams]);

  // Lấy truyện theo thể loại (hoặc tất cả nếu không có slug), có phân trang
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let items = [];
        let total = 1;

        if (slug) {
          const res = await fetch(`https://otruyenapi.com/v1/api/the-loai/${slug}?page=${page}`);
          const data = await res.json();
          items = data.data?.items || [];
          const pagination = data.data?.params?.pagination;
            total = pagination ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 1;


        } else {
          const res = await fetch(`https://otruyenapi.com/v1/api/danh-sach?type=truyen-moi&page=${page}`)
          const data = await res.json();
          items = data.data?.items || [];
         const pagination = data.data?.params?.pagination;
            total = pagination ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 1;


        }

        // Lọc status
        if (status) {
          items = items.filter(item => item.status?.toLowerCase() === status);
        }

        // Sắp xếp
        if (sort === "updated") {
          items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else if (sort === "chapter") {
          items.sort((a, b) => (b.chap || 0) - (a.chap || 0));
        } else if (sort === "name") {
          items.sort((a, b) => a.name.localeCompare(b.name));
        }

        setComics(items);
        setTotalPages(total);
        setLoading(false);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, sort, status, page]);

  // Xử lý chuyển trang
  const goToPage = (p) => {
    setSearchParams({ page: p });
  };

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 min-h-screen bg-white text-black">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-gray-600">
        <Link to="/" className="hover:underline text-blue-700">Trang chủ</Link>
        {" » "}
        <span>Thể loại</span>
        {currentCategory && <> {" » "} <span className="font-bold">{currentCategory.name}</span></>}
      </div>

      <div>
          <h1 className="text-2xl font-bold mb-2">
            Truyện tranh {currentCategory ? currentCategory.name : "Tất cả"} - Mới cập nhật
          </h1>

          <div className="mb-3 border border-gray-200 bg-gray-50 rounded px-3 py-2 text-gray-700">
            {currentCategory?.name
              ? `Thể loại hiện tại: ${currentCategory.name}`
              : "Đang xem tất cả thể loại"}
          </div>

          <div className="mb-4 relative" ref={panelRef}>
            <button
              onClick={() => setShowCategoryPanel((v) => !v)}
              className="w-full md:w-auto px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 text-left font-semibold"
            >
              {currentCategory ? `Thể loại: ${currentCategory.name}` : "Thể loại: Tất cả"}
              <span className="ml-2">{showCategoryPanel ? "▲" : "▼"}</span>
            </button>

            {showCategoryPanel && (
              <div className="absolute left-0 top-full mt-2 border border-gray-200 rounded bg-white shadow-xl p-4 w-full max-w-2xl z-40">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-[18px] leading-8 max-h-[360px] overflow-y-auto pr-1">
                  <Link
                    to="/the-loai"
                    onClick={() => setShowCategoryPanel(false)}
                    className={`font-semibold ${!slug ? "text-[#e74c3c]" : "text-gray-700 hover:text-[#e74c3c]"}`}
                  >
                    Tất cả
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/the-loai/${cat.slug}`}
                      onClick={() => setShowCategoryPanel(false)}
                      className={`${cat.slug === slug ? "text-[#e74c3c] font-semibold" : "text-gray-700 hover:text-[#e74c3c]"}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lọc trạng thái */}
          <div className="flex gap-2 mb-3">
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                className={`px-3 py-1 rounded text-sm font-semibold border ${status === opt.value ? "bg-[#00bcd4] text-white" : "bg-gray-100 text-gray-700"}`}
                onClick={() => setStatus(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Lọc sắp xếp */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="font-semibold text-sm mr-2">Sắp xếp theo:</span>
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                className={`px-2 py-1 rounded text-xs border ${sort === opt.value ? "bg-[#ffb300] text-white" : "bg-gray-100 text-gray-700"}`}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Danh sách truyện */}
          {loading ? (
            <div className="text-center text-gray-500 py-8">Đang tải...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {comics.map((item, idx) => (
                  <Link
                    to={`/truyen/${item.slug}`}
                    key={item._id || idx}
                    className="group bg-[#f7f7fa] rounded-lg shadow-md hover:shadow-xl transition-all duration-200 text-black block overflow-hidden border border-[#e0e0e0] hover:-translate-y-1 relative"
                  >
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                      <img
                        src={item.thumb_url ? `${cdnDomain}/uploads/comics/${item.thumb_url}` : "https://via.placeholder.com/150x220?text=No+Image"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200 border-b border-[#e0e0e0]"
                        loading="lazy"
                      />
                      {item.isHot && (
                        <span className="absolute top-2 right-2 bg-gradient-to-r from-[#ff512f] to-[#f09819] text-xs text-white font-bold px-2 py-0.5 rounded shadow">HOT</span>
                      )}
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <h3 className="text-base font-bold group-hover:text-[#ffb300] line-clamp-2 min-h-[2.5em] leading-tight">{item.name}</h3>
                      <div className="text-xs text-gray-500">Chapter {item.chap || item.chapter || "?"}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
      </div>
      {totalPages > 1 && !loading && !error && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            className="px-2 py-1 rounded border text-sm"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
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
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  key={`pagination-page-${p}`}
                  className={`px-3 py-1 rounded border text-sm ${page === p ? "bg-[#ffb300] text-white" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              )
            );
          })()}
          <button
            className="px-2 py-1 rounded border text-sm"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

