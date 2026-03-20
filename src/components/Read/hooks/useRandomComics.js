import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../config";

export const useRandomComics = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://otruyenapi.com/v1/api/home")
      .then((res) => res.json())
      .then((data) => {
        const items = data.data?.items?.flatMap((i) => i.comics) || [];
        const shuffled = items.sort(() => 0.5 - Math.random());
        setComics(shuffled.slice(0, 10));
      })
      .catch((err) => {
        console.error("Lỗi fetch random comics:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { randomComics: comics, loading, error };
};
