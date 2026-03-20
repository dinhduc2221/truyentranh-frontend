import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const Search = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    fetch(`https://otruyenapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.data?.items || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi tìm kiếm");
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="p-4">
      <h2 className="text-xl text-black font-bold mb-4">
        Kết quả tìm kiếm cho: <span className="text-red-600">{query}</span>
      </h2>
      {loading && <div>Đang tìm kiếm...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map((item, index) => (
          <Link
            to={`/truyen/${item.slug}`}
            key={item._id || item.slug || index}
            className="bg-white rounded shadow p-2 hover:shadow-lg transition text-black"
          >
            <img
              src={
                item.thumb_url
                  ? `https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`
                  : "https://via.placeholder.com/150x220?text=No+Image"
              }
              alt={item.name}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="mt-2 text-sm font-semibold line-clamp-2">{item.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.category?.map((cat, idx) => (
                <span
                  key={cat.id || idx}
                  className="text-xs bg-indigo-100 text-indigo-700 rounded px-2 py-0.5"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      {!loading && results.length === 0 && (
        <div className="text-gray-400 mt-4">Không tìm thấy truyện phù hợp.</div>
      )}
    </div>
  );
};

export default Search;
