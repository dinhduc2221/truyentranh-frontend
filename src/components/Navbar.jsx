import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import MobileMenu from "../components/MobileMenu";

const Navbar = ({ user, onLogout }) => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [readingHistory, setReadingHistory] = useState([]);
  const [historyComics, setHistoryComics] = useState({});
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef();
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    fetch("https://otruyenapi.com/v1/api/the-loai/")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.data?.items) ? data.data.items : [];
        setCategories(list.filter(cat => !!cat.slug));
      });
  }, []);

  // Fetch reading history
  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/user/history`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setReadingHistory(data.readingHistory || []));
  }, [user]);

  // Fetch comic info for history
  useEffect(() => {
    if (!user?.token || !readingHistory.length) return;
    const uniqueSlugs = [...new Set(readingHistory.map(h => h.slug))];
    Promise.all(
      uniqueSlugs.map(slug =>
        fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
          .then(res => res.json())
          .then(data => ({
            slug,
            name: data.data?.item?.name || slug,
            thumb_url: data.data?.item?.thumb_url || ""
          }))
      )
    ).then(arr => {
      const obj = {};
      arr.forEach(item => {
        obj[item.slug] = item;
      });
      setHistoryComics(obj);
    });
  }, [user, readingHistory]);

  // Close account menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[#44346a] shadow z-50 border-b border-[#4e3a7a] font-sans h-14 flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-2 sm:px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center select-none">
            <span
              className="text-xl sm:text-2xl font-extrabold tracking-wide"
              style={{
                fontFamily: "'Baloo 2', cursive",
                color: "#fff",
                letterSpacing: "1px",
                textShadow: "0 1px 2px #000"
              }}
            >
              <span style={{ color: "#3ec6e0" }}>Mộng</span>
              <span style={{ color: "#ff4e8a" }}>Truyện</span>
            </span>
          </Link>
          {/* Desktop */}
          <div className="hidden md:flex items-center flex-1 justify-between ml-4">
            {/* Thể loại */}
            <div>
              <button
                className="text-white bg-[#5a469a] hover:bg-[#6d59b8] rounded px-3 py-1 text-xs sm:text-sm font-bold"
                onClick={() => navigate("/the-loai")}
              >
                Thể loại
              </button>
            </div>
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex justify-center px-2">
              <input
                type="text"
                placeholder="Tìm truyện..."
                className="w-full max-w-xl px-4 py-2 rounded bg-white text-black outline-none text-xs sm:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="ml-[-2.5rem] text-gray-700 text-xl bg-transparent border-0"
              >
                <span role="img" aria-label="search">🔍</span>
              </button>
            </form>
            {/* User */}
            <div className="relative" ref={accountMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    className="text-white text-xs sm:text-sm font-semibold"
                  >
                    Thông tin tài khoản
                  </button>
                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg w-40 z-50">
                      <Link
                        to="/profile"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Xem hồ sơ
                      </Link>
                      <button
                        onClick={() => {
                          onLogout();
                          setAccountMenuOpen(false);
                          window.location.href = "/";
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    className="text-white text-xs sm:text-sm font-semibold"
                  >
                    Tài khoản
                  </button>
                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg w-32 z-50">
                      <Link
                        to="/login"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
          {/* Mobile: Hamburger */}
          <button
            className="md:hidden flex items-center justify-center text-white text-2xl p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Mở menu"
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
        user={user}
        onLogout={onLogout}
        historyComics={historyComics}
        readingHistory={readingHistory}
      />

      {/* Padding */}
      <div className="h-14" />
    </>
  );
};

export default Navbar;
