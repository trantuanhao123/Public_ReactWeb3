import React, { useState, useEffect } from "react";
import axios from "axios";

function QuestionForm() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [maNguoiChoi, setMaNguoiChoi] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios
      .get("https://public-nodejs.onrender.com/v1/api/generateQuestion")
      .then((response) => {
        if (response.data.success) {
          setQuestions(response.data.data);
          const initialAnswers = {};
          response.data.data.forEach((q) => {
            initialAnswers[q.cauHoi] = "";
          });
          setAnswers(initialAnswers);
        }
      })
      .catch((error) => console.error("Lỗi tải câu hỏi:", error));
  }, []);

  const handleAnswerChange = (question, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: value,
    }));
  };

  const validateAnswers = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const answer = answers[q.cauHoi]?.trim();
      if (!answer) return "Vui lòng trả lời tất cả các câu hỏi!";
      if (
        q.loai === "true_false" &&
        !["true", "false"].includes(answer.toLowerCase())
      ) {
        return `Câu ${i + 1} chỉ chấp nhận 'True' hoặc 'False'!`;
      }
      if (
        q.loai === "short_answer" &&
        (!answer.startsWith("[") || !answer.endsWith("]"))
      ) {
        return `Câu ${i + 1} yêu cầu pipeline MongoDB dạng JSON!`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!maNguoiChoi.trim() || !walletAddress.trim()) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const validationError = validateAnswers();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    const data = {
      maNguoiChoi,
      diaChiVi: walletAddress,
      questions: questions.map((q) => q.cauHoi),
      answers: questions.map((q) => answers[q.cauHoi]),
    };
    console.log(data);
    try {
      const response = await axios.post(
        "https://public-nodejs.onrender.com/v1/api/kiemtra",
        data
      );
      if (response.data.success) {
        const { isPassed, ketQua } = response.data.data;
        setResult({ isPassed, ketQua });
        setMessage(`Kết quả: ${isPassed ? "Đạt" : "Không đạt"}`);
      } else {
        setMessage(response.data.message || "Có lỗi xảy ra!");
        setResult(null);
      }
    } catch (error) {
      setMessage("Lỗi gửi dữ liệu!");
      setResult(null);
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold" style={{ textAlign: "center" }}>
        Mô hình tuyển dụng ngành IT theo Blockchain
      </h1>
      <h2>Kiểm tra kiến thức</h2>
      {questions.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Tên người ứng tuyển:</label>
            <input
              type="text"
              value={maNguoiChoi}
              onChange={(e) => setMaNguoiChoi(e.target.value)}
              required
              placeholder="Nhập tên ứng viên"
            />
          </div>
          <div>
            <label>Địa chỉ ví:</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              required
              placeholder="Nhập địa chỉ ví Blockchain"
            />
          </div>

          {questions.map((question, index) => (
            <div key={index}>
              <p>
                <strong>Câu {index + 1}:</strong> {question.cauHoi}
              </p>
              {question.loai === "true_false" ? (
                <input
                  type="text"
                  value={answers[question.cauHoi] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.cauHoi, e.target.value)
                  }
                  required
                  placeholder="Nhập True/False"
                />
              ) : (
                <textarea
                  value={answers[question.cauHoi] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.cauHoi, e.target.value)
                  }
                  required
                  placeholder='Nhập pipeline MongoDB dạng JSON, ví dụ: [{"$match": {"field": "value"}}]'
                />
              )}
            </div>
          ))}
          <button type="submit">Gửi câu trả lời</button>
        </form>
      ) : (
        <p>Đang tải câu hỏi...</p>
      )}
      {message && <p>{message}</p>}
      {result && (
        <div>
          <h3>Kết quả kiểm tra:</h3>
          <p>Trạng thái: {result.isPassed ? "Đạt" : "Không đạt"}</p>
          <ul>
            {result.ketQua.map((item, index) => (
              <li key={index}>
                <p>
                  <strong>Câu hỏi:</strong> {item.cauHoi}
                </p>
                <p>
                  <strong>Câu trả lời của bạn:</strong> {item.cauTraLoi}
                </p>
                <p>
                  <strong>Kết quả:</strong> {item.isTrue ? "Đúng" : "Sai"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default QuestionForm;
