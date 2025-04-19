import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useNavigate } from "react-router-dom";

// Default schema
const defaultSchema = {
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

// Default UI schema
const defaultUiSchema = {
  name: {
    "ui:placeholder": "Nhập tên người chơi",
  },
};

export default function CreatePlayer() {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [schema, setSchema] = useState(defaultSchema);
  const [uiSchema, setUiSchema] = useState(defaultUiSchema);
  const [jsonSchema, setJsonSchema] = useState(
    JSON.stringify(defaultSchema, null, 2)
  );
  const [jsonUiSchema, setJsonUiSchema] = useState(
    JSON.stringify(defaultUiSchema, null, 2)
  );
  const [schemaError, setSchemaError] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [formData, setFormData] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [countdown, setCountdown] = useState(20);

  const navigate = useNavigate();

  // Initialize formData based on schema
  const initializeFormData = (newSchema) => {
    const newFormData = {};
    const properties = newSchema.properties || {};
    Object.keys(properties).forEach((key) => {
      if (properties[key].default !== undefined) {
        newFormData[key] = properties[key].default;
      }
    });
    return newFormData;
  };

  // Validate schema to ensure 'name' field exists
  const validateSchema = (parsedSchema) => {
    if (
      !parsedSchema.properties?.name ||
      !parsedSchema.required?.includes("name")
    ) {
      return "Schema phải bao gồm trường 'name' và nó phải là trường bắt buộc.";
    }
    return null;
  };

  // Handle JSON Schema changes
  const handleSchemaChange = (e) => {
    const newJsonSchema = e.target.value;
    setJsonSchema(newJsonSchema);
    try {
      const parsedSchema = JSON.parse(newJsonSchema);
      const validationError = validateSchema(parsedSchema);
      if (validationError) {
        setSchemaError(validationError);
        return;
      }
      setSchema(parsedSchema);
      setSchemaError(null);
      const newFormData = initializeFormData(parsedSchema);
      setFormData((prevFormData) => ({
        ...newFormData,
        ...Object.keys(prevFormData)
          .filter((key) => parsedSchema.properties[key])
          .reduce((acc, key) => {
            acc[key] = prevFormData[key];
            return acc;
          }, {}),
      }));
    } catch (err) {
      setSchemaError("JSON Schema không hợp lệ. Vui lòng kiểm tra cú pháp.");
    }
  };

  // Handle UI Schema changes
  const handleUiSchemaChange = (e) => {
    const newJsonUiSchema = e.target.value;
    setJsonUiSchema(newJsonUiSchema);
    try {
      const parsedUiSchema = JSON.parse(newJsonUiSchema);
      setUiSchema(parsedUiSchema);
      setSchemaError(null);
    } catch (err) {
      setSchemaError("UI Schema không hợp lệ. Vui lòng kiểm tra cú pháp.");
    }
  };

  // Handle form changes
  const handleFormChange = ({ formData }) => {
    setFormData(formData);
  };

  // Handle preview
  const handlePreview = () => {
    const allFieldsData = {};
    Object.keys(schema.properties).forEach((key) => {
      allFieldsData[key] = formData[key] !== undefined ? formData[key] : null;
    });

    if (Object.keys(allFieldsData).length === 0) {
      setPreviewData("Chưa có dữ liệu để xem trước.");
    } else {
      setPreviewData(JSON.stringify(allFieldsData, null, 2));
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép vào clipboard!");
  };

  // Handle confirmation submission
  const handleConfirmSubmit = async () => {
    try {
      const newWallet = ethers.Wallet.createRandom();
      const playerData = {
        ...formData,
        walletAddress: newWallet.address,
        tokenBalance: 0,
      };

      const response = await axios.post(
        "http://localhost:8089/v1/api/createplayer",
        playerData
      );

      if (response.data.success) {
        const wallet = response.data.data;
        const formDataDisplay = Object.entries(formData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        const successText =
          `🎯 Ghi chú quan trọng:\n` +
          `Hãy lưu lại thông tin ví này, bạn sẽ cần nó cho các bước tiếp theo!\n\n` +
          `${formDataDisplay}\n` +
          `Địa Chỉ Ví: ${wallet.walletAddress}\n` +
          `Số Dư: ${wallet.tokenBalance} Token`;

        setSuccessMessage(successText);
        setShowConfirmModal(true);
        setCountdown(20);
      }
    } catch (err) {
      console.error("Lỗi khi lưu ví:", err);
      setError("Lưu ví thất bại, có thể do tên người chơi đã tồn tại.");
    }
  };

  // Countdown effect for modal
  useEffect(() => {
    let timer;
    if (showConfirmModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate("/question");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showConfirmModal, countdown, navigate]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Khai báo thông tin</h2>
      <p className="text-red-600 mb-2">
        Lưu ý: Bạn không cần nhập thông tin cá nhân
      </p>
      <p className="text-red-600 mb-4">
        Lưu ý: Đảm bảo bạn ghi chú lại địa chỉ ví của mình
      </p>

      {/* Schema Editors - Side by Side */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* JSON Schema editor */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">JSON Schema</h3>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm resize-y text-base font-mono bg-white"
            value={jsonSchema}
            onChange={handleSchemaChange}
            rows={20}
            style={{ minHeight: "300px" }}
          />
        </div>

        {/* UI Schema editor */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">UI Schema</h3>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm resize-y text-base font-mono bg-white"
            value={jsonUiSchema}
            onChange={handleUiSchemaChange}
            rows={20}
            style={{ minHeight: "300px" }}
          />
        </div>
      </div>

      {/* Schema error */}
      {schemaError && <p className="text-red-600 mt-2">{schemaError}</p>}

      {/* Form */}
      <Form
        schema={schema}
        uiSchema={uiSchema}
        onChange={handleFormChange}
        validator={validator}
        key={`${JSON.stringify(schema)}-${JSON.stringify(uiSchema)}`}
        formData={formData}
        className="mt-6"
      >
        <div className="mt-4">
          <button
            type="button"
            onClick={handlePreview}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Xem trước
          </button>
        </div>
      </Form>

      {/* Preview data */}
      {previewData && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">
            Cấu trúc dữ liệu trước khi gửi:
          </h3>
          <pre className="bg-gray-100 p-4 rounded">{previewData}</pre>
          <div className="mt-2">
            <button
              onClick={handleConfirmSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Xác nhận gửi
            </button>
            <button
              onClick={() => setPreviewData(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-600 mt-2">{error}</p>}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Thông tin ví của bạn</h3>
            <pre className="bg-gray-100 p-4 rounded mb-4">{successMessage}</pre>
            <button
              onClick={() => copyToClipboard(successMessage)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Sao chép thông tin
            </button>
            <p className="text-gray-600">
              Sẽ chuyển hướng sau {countdown} giây...
            </p>
            <button
              onClick={() => navigate("/question")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
            >
              Chuyển hướng ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
