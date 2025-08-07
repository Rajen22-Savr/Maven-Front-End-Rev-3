import React, { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [file, setFile] = useState(null);
  const [topSuppliers, setTopSuppliers] = useState([]);
  const [outliers, setOutliers] = useState([]);
  const [actions, setActions] = useState([]);
  const [dynamicInsights, setDynamicInsights] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://maven-backend-j2mj.onrender.com/upload/",
        formData
      );
      setTopSuppliers(response.data.top_suppliers);
      setOutliers(response.data.outliers);
      setActions(response.data.actions);
      setDynamicInsights(response.data.dynamic_insights || []);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Maven Copilot</h1>
        <ul>
          <li className="mb-2">Upload</li>
          <li className="mb-2">Insights</li>
          <li className="mb-2">Copilot</li>
        </ul>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Spend Insights Generator</h2>
        <div className="mb-6">
          <input type="file" onChange={handleFileChange} className="mr-2" />
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Upload & Analyze
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Top Suppliers</h3>
            <ul>
              {topSuppliers.map((item, index) => (
                <li key={index}>
                  {item["Supplier Name"]}: ${item["Potential Savings"].toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Outliers</h3>
            <ul>
              {outliers.map((item, index) => (
                <li key={index}>
                  {item["Item Name"]} ({item["Supplier Name"]}): ${item["CY vs PY WAP USD (Fiscal)"]}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {dynamicInsights.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h4 className="font-semibold mb-2">🤖 AI-Generated Insights</h4>
            <ul className="list-disc list-inside">
              {dynamicInsights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;