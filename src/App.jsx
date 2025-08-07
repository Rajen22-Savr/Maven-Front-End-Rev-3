import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [topSuppliers, setTopSuppliers] = useState([]);
  const [outliers, setOutliers] = useState([]);
  const [actions, setActions] = useState([]);
  const [dynamicInsights, setDynamicInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await axios.post(
        //"https://maven-backend-j2mj.onrender.com/upload/",
        "https://maven-backend-agentic-ver-3-5.onrender.com/upload/",
        formData
      );
      setTopSuppliers(response.data.top_suppliers);
      setOutliers(response.data.outliers);
      setActions(response.data.actions);
      setDynamicInsights(response.data.dynamic_insights || []);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Maven Copilot</h2>
        <nav className="flex flex-col space-y-4">
          <span className="hover:text-blue-300 cursor-pointer">Dashboard</span>
          <span className="hover:text-blue-300 cursor-pointer">Insights</span>
          <span className="hover:text-blue-300 cursor-pointer">Settings</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold mb-4">📊 Upload Spend File</h1>
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-500"
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Upload and Analyze"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topSuppliers.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">🏆 Top Suppliers</h3>
              <ul className="list-disc ml-5 space-y-1">
                {topSuppliers.map((item, index) => (
                  <li key={index}>
                    {item["Supplier Name"]}: $
                    {Number(item["Potential Savings"] || 0).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {outliers.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">📉 Pricing Outliers</h3>
              <ul className="list-disc ml-5 space-y-1">
                {outliers.map((item, index) => (
                  <li key={index}>
                    {item["Item Name"]} ({item["Supplier Name"]}): $
                    {item["CY vs PY WAP USD (Fiscal)"]}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {actions.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
              <h3 className="font-semibold text-lg mb-2">💡 Recommended Actions</h3>
              <ul className="list-disc ml-5 space-y-1">
                {actions.map((action, index) => (
                  <li key={index}>
                    {action.type}: {action.supplier || action.note}
                    {action.savings && ` - ${action.savings}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {dynamicInsights.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
              <h3 className="font-semibold text-lg mb-2">🤖 AI-Generated Insights</h3>
              <ul className="list-disc ml-5 space-y-3">
                {dynamicInsights.map((insight, index) => (
                  <li key={index}>
                    <p className="font-semibold">{insight.item}</p>
                    <p className="text-sm text-gray-600">{insight.insight_text}</p>
                    <p className="text-sm italic text-gray-800">📌 {insight.recommended_action}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Copilot Prompt Box */}
        <div className="bg-white p-4 rounded-lg shadow mt-8">
          <h3 className="text-lg font-semibold mb-2">💬 Ask Maven</h3>
          <input
            type="text"
            placeholder="What would you like to know about your spend?"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
