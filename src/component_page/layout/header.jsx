import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar" style={{ display: "flex", justifyContent: "center", padding: "10px 0", backgroundColor: "#fff" }}>
      <ul className="menu" style={{ listStyle: "none", display: "flex", gap: "20px", padding: 0, margin: 0 }}>
        <li className="menu-item" style={{ fontWeight: "bold" }}>
          <a onClick={() => navigate("/")} style={{ textDecoration: "none", color: "#000", cursor: "pointer" }}>Home</a>
        </li>
        <li className="menu-item" style={{ fontWeight: "bold" }}>
          <a onClick={() => navigate("/create-player")} style={{ textDecoration: "none", color: "#000", cursor: "pointer" }}>Wallet</a>
        </li>
        <li className="menu-item" style={{ fontWeight: "bold" }}>
          <a onClick={() => navigate("/question-form")} style={{ textDecoration: "none", color: "#000", cursor: "pointer" }}>Game</a>
        </li>
        <li className="menu-item" style={{ fontWeight: "bold" }}>
          <a onClick={() => navigate("/thong-bao")} style={{ textDecoration: "none", color: "#000", cursor: "pointer" }}>Winner List</a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;