// src/api/deposit.js
import { API_BASE_URL } from "../../../../config";

export async function createDeposit({ price, method, token }) {
  const res = await fetch(`${API_BASE_URL}/api/deposits/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ price, method }),
  });

  if (!res.ok) {
    let message = "Lỗi không xác định";
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      const text = await res.text();
      message = text || message;
    }
    throw new Error(message);
  }

  return res.json();
}
