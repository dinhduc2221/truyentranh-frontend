import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import FollowedComics from "./FollowedComics";
import HistoryComics from "./HistoryComics";
import TabNavigation from "./TabNavigation";
import Comments from "./Comments";

const ProfileContainer = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [followed, setFollowed] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("followed");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [tuVi, setTuVi] = useState("");
  const [role, setRole] = useState("");
  const [crystal, setCrystal] = useState(0);

  const navigate = useNavigate();

  // Fetch profile
  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setEmail(data.email || "");
        setTuVi(data.tuVi || "Phàm Nhân");
        setRole(data.role || "member");
        setCrystal(data.linhThach || 0);
        setLoading(false);
      });
  }, [user]);

  // Fetch followed comics
  useEffect(() => {
    if (!user?.token || tab !== "followed") return;
    fetch(`${API_BASE_URL}/api/user/followed`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(async data => {
        const slugs = data.followedComics || [];
        const comics = await Promise.all(
          slugs.map(slug =>
            fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
              .then(res => res.json())
              .then(d => ({
                slug,
                name: d.data?.item?.name || slug,
                thumb_url: d.data?.item?.thumb_url || "",
                author: Array.isArray(d.data?.item?.author)
                  ? d.data.item.author.join(", ")
                  : d.data?.item?.author || "",
                status: d.data?.item?.status || "",
                chap: d.data?.item?.chap || ""
              }))
              .catch(() => ({
                slug,
                name: slug,
                thumb_url: "",
                author: "",
                status: "",
                chap: ""
              }))
          )
        );
        setFollowed(comics);
      });
  }, [user, tab]);

  // Fetch reading history
  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/user/history`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(async data => {
        const historyArr = data.readingHistory || [];
        const uniqueSlugs = [...new Set(historyArr.map(h => h.slug))];
        const comicsInfo = await Promise.all(
          uniqueSlugs.map(slug =>
            fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
              .then(res => res.json())
              .then(d => ({
                slug,
                name: d.data?.item?.name || slug,
                thumb_url: d.data?.item?.thumb_url || ""
              }))
              .catch(() => ({
                slug,
                name: slug,
                thumb_url: ""
              }))
          )
        );
        const infoMap = {};
        comicsInfo.forEach(c => {
          infoMap[c.slug] = c;
        });
        setHistory(
          historyArr.map(h => ({
            ...h,
            name: infoMap[h.slug]?.name || h.slug,
            thumb_url: infoMap[h.slug]?.thumb_url || ""
          }))
        );
      });
  }, [user]);

  if (!user?.token) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center">
        <div className="text-lg mb-4">Bạn chưa đăng nhập.</div>
        <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (loading || !profile) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center">
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Left vertical navbar */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gray-100" style={{ width: 24, minWidth: 24 }}>
        {/* Có thể thêm icon hoặc để trống */}
      </div>
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-6xl bg-white text-black min-h-screen">
          <ProfileHeader onLogout={onLogout} />
          <ProfileCard
            profile={profile}
            email={email}
            setEmail={setEmail}
            crystal={crystal}
            tuVi={tuVi}
            role={role}
          />
          <TabNavigation tab={tab} setTab={setTab} />
          {tab === "followed" ? (
            <FollowedComics comics={followed} />
          ) : tab === "history" ? (
            <HistoryComics history={history} />
          ) : (
            <Comments user={user} />
          )}
        </div>
      </div>
      {/* Right vertical navbar */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gray-100" style={{ width: 24, minWidth: 24 }}>
        {/* Có thể thêm icon hoặc để trống */}
      </div>
    </div>
  );
};

export default ProfileContainer;
