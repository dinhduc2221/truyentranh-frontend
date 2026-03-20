import React from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const Breadcrumbs = ({ links, current }) => (
  <div className="text-xs text-gray-500 mb-2">
    {links.map((link, i) => (
      <span key={i}>
        <Link to={link.to} className="hover:underline text-blue-700">
          {link.label}
        </Link>
        {i < links.length - 1 && " » "}
      </span>
    ))}
    <span className="font-semibold">{current}</span>
  </div>
);

export default Breadcrumbs;