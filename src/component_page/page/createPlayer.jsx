import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

export default function CreatePlayer() {
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [wallet, setWallet] = useState(null);

  const createPlayer = async () => {
    if (!name.trim()) {
      setError("Vui lòng nhập tên người chơi!");
      setWallet(null);
      return;
    }

    try {
      const newWallet = ethers.Wallet.createRandom();
      const playerData = {
        name: name,
        walletAddress: newWallet.address,
        tokenBalance: 0,
      };
      const response = await axios.post("https://public-nodejs.onrender.com/v1/api/createplayer", playerData);
      setWallet(response.data.data);
      console.log("Dữ liệu post: ", wallet);
      setError(null);
      alert("Ví đã được lưu vào cơ sở dữ liệu!");
    } catch (err) {
      console.error("Lỗi khi lưu ví:", err);
      setError("Lưu ví thất bại, có thể do tên người chơi đã tồn tại");
      setWallet(null);
    }
  };

  return (
    <div>
      <h2>Khai báo thông tin</h2>
      <p>Lưu ý: Bạn không cần nhập thông tin cá nhân</p>
      <p>Lưu ý: Đảm bảo bạn ghi chú lại địa chỉ ví của mình</p>
      <div>
        <label htmlFor="playerName">Tên ứng tuyển (Nickname,.....):</label>
        <input
          type="text"
          id="playerName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên ứng tuyển"
        />
      </div>
      <button onClick={createPlayer} disabled={!name.trim()}>
        Tạo ví
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {wallet && !error && (
        <div>
          <p><strong>Người Ứng Tuyển:</strong> {wallet.name || "Không có dữ liệu"}</p>
          <p><strong>Địa Chỉ Ví:</strong> {wallet.walletAddress || "Không có dữ liệu"}</p>
          <p><strong>Số Dư:</strong> {wallet.tokenBalance !== undefined ? `${wallet.tokenBalance} Token` : "Không có dữ liệu"}</p>
        </div>
      )}
    </div>
  );
}
