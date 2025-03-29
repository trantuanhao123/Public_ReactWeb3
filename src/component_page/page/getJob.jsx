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
        const response = await axios.get("https://nodejs-web3.onrender.com/v1/api/getjob");
        if (response.data.success) {
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
      const checkResponse = await axios.post(
        "https://nodejs-web3.onrender.com/v1/api/kiemtrajob",
        {
          userAnswer: answer.trim(),
          jobAnswer: selectedJob.correctAnswer.trim(),
        }
      );

      if (!checkResponse.data.success) {
        setErrorMessage(checkResponse.data.message || "Có lỗi khi kiểm tra câu trả lời!");
        return;
      }

      const { isTrue } = checkResponse.data.data;

      if (!isTrue) {
        setErrorMessage("Câu trả lời chưa chính xác. Vui lòng thử lại!");
        return;
      }

      await axios.post("https://nodejs-web3.onrender.com/v1/api/createwinner", {
        jobTitle: selectedJob.title,
        userAnswer: answer,
        maNguoiChoi: maNguoiChoi,
        diaChiVi: diaChiVi,
      });

      await axios.post("https://nodejs-web3.onrender.com/v1/api/updateplayer", {
        maNguoiChoi: maNguoiChoi,
        tokenBalance: selectedJob.rewardAmount,
      });

      await axios.post("https://nodejs-web3.onrender.com/v1/api/updatejobs", {
        title: selectedJob.title,
      });

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
            placeholder="Nhập câu trả lời của bạn"
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
