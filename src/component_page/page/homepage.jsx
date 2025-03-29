import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button className="btn-wallet" onClick={() => navigate('/create-player')}>
        Tạo Ví
      </button>
      <button className="btn-connect-wallet" onClick={() => navigate('/thong-bao')}>
        Kết nối ví
      </button>
    </nav>
  );
};

export default HomePage;
