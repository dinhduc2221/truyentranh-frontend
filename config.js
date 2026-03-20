const apiMode = (import.meta.env.VITE_API_MODE || "auto").trim().toLowerCase();
const explicitBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const localApiPort = (import.meta.env.VITE_API_LOCAL_PORT || "3001").trim();
const localApiUrl = (
	import.meta.env.VITE_API_LOCAL_URL || `http://localhost:${localApiPort}`
).trim();
const railwayApiUrl = (
	import.meta.env.VITE_API_RAILWAY_URL ||
	"https://truyentranh-backend-production.up.railway.app"
).trim();

const isBrowser = typeof window !== "undefined";
const hostname = isBrowser ? window.location.hostname : "";
const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

const modeResolved =
	apiMode === "local" || apiMode === "railway"
		? apiMode
		: isLocalHost
			? "local"
			: "railway";

const rawBaseUrl = explicitBaseUrl || (modeResolved === "local" ? localApiUrl : railwayApiUrl);

// Remove trailing slash to avoid URLs like //api/...
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

if (!API_BASE_URL) {
	console.warn(
		"API base URL is empty. Set VITE_API_RAILWAY_URL (Vercel) or VITE_API_LOCAL_URL/VITE_API_LOCAL_PORT (local)."
	);
}
