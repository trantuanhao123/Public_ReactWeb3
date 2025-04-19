import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useNavigate } from "react-router-dom";

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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

      const wallet = response.data.data;

      // Hiển thị thông tin bằng alert
      alert(
        "🎯 Ghi chú quan trọng:\n" +
        "Hãy lưu lại thông tin ví này, bạn sẽ cần nó cho các bước tiếp theo!\n\n" +
        `Người Ứng Tuyển: ${wallet.name}\n` +
        `Địa Chỉ Ví: ${wallet.walletAddress}\n` +
        `Số Dư: ${wallet.tokenBalance} Token`
      );
      // Sau khi bấm OK trong alert => điều hướng
      navigate("/question");
    } catch (err) {
      console.error("Lỗi khi lưu ví:", err);
      setError("Lưu ví thất bại, có thể do tên người chơi đã tồn tại");
    }
  };

  return (
    <div>
      <h2>Khai báo thông tin</h2>
      <p>Lưu ý: Bạn không cần nhập thông tin cá nhân</p>
      <p>Lưu ý: Đảm bảo bạn ghi chú lại địa chỉ ví của mình</p>

      <Form schema={schema} onSubmit={handleSubmit} validator={validator} />

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
