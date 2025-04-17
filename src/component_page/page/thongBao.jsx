import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PredictionsList = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [diaChiViInput, setDiaChiViInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get("https://public-nodejs.onrender.com/v1/api/getwinner");
        if (!response.data.success || !Array.isArray(response.data.data) || response.data.data.length === 0) {
          setPredictions([]);
          return;
        }
        setPredictions(response.data.data);
      } catch (err) {
        setError("Không thể tải dữ liệu.");
      }
    };
    fetchPredictions();
  }, []);

  const handleConnectPlayer = (player) => {
    setSelectedPlayer(player);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPlayer && diaChiViInput === selectedPlayer.diaChiVi) {
      sessionStorage.setItem("connectedPlayer", JSON.stringify(selectedPlayer));
      navigate("/getjobs");
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {predictions.length === 0 ? (
        <p>Không có dữ liệu.</p>
      ) : (
        <ul>
          {predictions.map((pred) => (
            <li key={pred.maNguoiChoi}>
              Người Ứng Tuyển: {pred.maNguoiChoi}
              <button onClick={() => handleConnectPlayer(pred)}>Kết nối</button>
            </li>
          ))}
        </ul>
      )}
      {selectedPlayer && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={diaChiViInput}
            onChange={(e) => setDiaChiViInput(e.target.value)}
          />
          <button type="submit">Xác nhận</button>
        </form>
      )}
    </div>
  );
};

export default PredictionsList;
