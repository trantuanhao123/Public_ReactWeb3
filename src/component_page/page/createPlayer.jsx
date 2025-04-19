import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8"; 

const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Tên người chơi",
      minLength: 1,
    },
  },
  required: ["name"],
};

export default function CreatePlayer() {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async ({ formData }) => {
    try {
      const newWallet = ethers.Wallet.createRandom();
      const playerData = {
        name: formData.name,
        walletAddress: newWallet.address,
        tokenBalance: 0,
      };
      const response = await axios.post(
        "https://public-nodejs.onrender.com/v1/api/createplayer",
        playerData
      );
      setWallet(response.data.data);
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

      <Form schema={schema} onSubmit={handleSubmit} validator={validator} />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {wallet && !error && (
        <div>
          <p><strong>Người Ứng Tuyển:</strong> {wallet.name}</p>
          <p><strong>Địa Chỉ Ví:</strong> {wallet.walletAddress}</p>
          <p><strong>Số Dư:</strong> {wallet.tokenBalance} Token</p>
        </div>
      )}
    </div>
  );
}
