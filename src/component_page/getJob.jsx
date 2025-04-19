import React, { useEffect, useState } from "react";
import axios from "axios";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const storedWinner = sessionStorage.getItem("connectedPlayer");
    if (!storedWinner) {
      setWinner(null);
      setLoading(false);
      return;
    }

    setWinner(JSON.parse(storedWinner));

    const fetchJobs = async () => {
      try {
        const response = await axios.get("https://public-nodejs.onrender.com/v1/api/getjob");
        if (response.data.success) {
          console.log("Fetched jobs:", response.data.data); // Debug job data
          setJobs(response.data.data);
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = (job) => {
    setSelectedJob(job);
    setAnswer("");
    setErrorMessage("");
  };

  const handleSubmitAnswer = async () => {
    setErrorMessage("");
    if (!selectedJob || !answer) {
      setErrorMessage("Vui lòng chọn công việc và nhập câu trả lời!");
      return;
    }

    const connectedPlayer = JSON.parse(sessionStorage.getItem("connectedPlayer"));
    if (!connectedPlayer || !connectedPlayer.maNguoiChoi) {
      setErrorMessage("Không tìm thấy mã người chơi. Vui lòng kết nối lại!");
      return;
    }
    const { maNguoiChoi, diaChiVi } = connectedPlayer;

    if (!selectedJob.rewardAmount) {
      setErrorMessage("Công việc này không có phần thưởng. Vui lòng liên hệ hỗ trợ!");
      return;
    }

    try {
      // Normalize user answer
      const userAnswer = answer.trim();

      // Check if correctAnswer exists
      if (!selectedJob.correctAnswer) {
        setErrorMessage("Câu trả lời đúng không tồn tại trong dữ liệu công việc!");
        return;
      }

      let correctAnswer;
      try {
        // Handle correctAnswer based on its type
        if (typeof selectedJob.correctAnswer === "string") {
          correctAnswer = selectedJob.correctAnswer.trim();
        } else {
          correctAnswer = JSON.stringify(selectedJob.correctAnswer).trim();
        }
      } catch (err) {
        console.error("Lỗi khi xử lý correctAnswer:", err);
        setErrorMessage("Lỗi định dạng câu trả lời đúng từ cơ sở dữ liệu!");
        return;
      }

      // Log for debugging
      console.log("User Answer:", userAnswer);
      console.log("Correct Answer:", correctAnswer);

      // Compare answers
      const isCorrect = userAnswer === correctAnswer;

      if (!isCorrect) {
        setErrorMessage("Câu trả lời chưa chính xác. Vui lòng thử lại!");
        return;
      }

      // Create winner record
      await axios.post("https://public-nodejs.onrender.com/v1/api/createwinner", {
        jobTitle: selectedJob.title,
        userAnswer: answer,
        maNguoiChoi: maNguoiChoi,
        diaChiVi: diaChiVi,
      });

      // Update player token balance
      await axios.post("https://public-nodejs.onrender.com/v1/api/updateplayer", {
        maNguoiChoi: maNguoiChoi,
        tokenBalance: selectedJob.rewardAmount,
      });
      //Update job status
      await axios.post("https://public-nodejs.onrender.com/v1/api/updatejobs", {
        title: selectedJob.title,
      });
      // Update local job state
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.title === selectedJob.title ? { ...job, isCompleted: true } : job
        )
      );

      setSuccessMessage(
        `Ứng tuyển thành công và nhận được ${selectedJob.rewardAmount} token! Công việc đã hoàn thành.`
      );
      setSelectedJob(null);
      setAnswer("");
    } catch (err) {
      console.error("Lỗi trong handleSubmitAnswer:", err);
      setErrorMessage(`Lỗi: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!winner) return <p style={{ color: "gray", fontStyle: "italic" }}>Bạn không chiến thắng</p>;
  if (error) return <p style={{ color: "red" }}>Lỗi: {error}</p>;

  return (
    <div>
      {successMessage && <div>🎉 {successMessage} 🎉</div>}
      <h2>Danh sách công việc</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Phần thưởng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.description}</td>
              <td>{job.rewardAmount} token</td>
              <td>
                {job.isCompleted ? (
                  <span style={{ color: "gray" }}>Đã hoàn thành</span>
                ) : (
                  <button onClick={() => handleApply(job)}>Ứng tuyển</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedJob && (
        <div>
          <h3>Ứng tuyển: {selectedJob.title}</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Nhập câu trả lời của bạn (JSON pipeline hoặc chuỗi)"
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button onClick={handleSubmitAnswer}>Gửi</button>
          <button onClick={() => setSelectedJob(null)}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default JobList;