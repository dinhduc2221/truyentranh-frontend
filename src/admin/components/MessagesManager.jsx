import React from "react";
import { API_BASE_URL } from "../../../config";

const MessagesManager = ({ comments }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-[#2196f3]">Bình luận</h2>
    {comments.length === 0 && (
      <p className="text-gray-500 text-lg">Không có bình luận nào.</p>
    )}
    {comments.length > 0 && (
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">Tài khoản</th>
              <th className="border p-3 text-left">Truyện</th>
              <th className="border p-3 text-left">Nội dung</th>
              <th className="border p-3 text-left">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-gray-50">
                <td className="border p-3">{comment.User?.username || comment.username}</td>
                <td className="border p-3">{comment.comicSlug}</td>
                <td className="border p-3">{comment.content}</td>
                <td className="border p-3">
                  {new Date(comment.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    )}
  </div>
);

export default MessagesManager;
