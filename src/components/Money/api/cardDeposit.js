// src/api/cardDeposit.js
import { API_BASE_URL } from "../../../../config";

export async function createCardDeposit({
  price,
  cardType,
  cardSerial,
  cardCode,
  token,
}) {
  const res = await fetch(`${API_BASE_URL}/api/card-deposits/request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        price,
        cardType,
        cardSerial,
        cardCode,
      }),
    }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Lỗi khi gửi yêu cầu nạp thẻ");
  }

  return res.json();
}
