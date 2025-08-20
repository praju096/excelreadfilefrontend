import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { DataRow } from "../types/dataTypes";
import { formatDates, removeDuplicates, validateRows } from "../utils/excelHelper";

const ExcelFileUpload = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 20;

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      setError("Invalid file type. Please upload an Excel file (.xlsx or .xls).");
      return;
    }

    setError(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const arrayBuffer = evt.target?.result;
      if (!arrayBuffer) return;

      const worker = new Worker(new URL("./excelFileWorker.tsx", import.meta.url));

      worker.postMessage(arrayBuffer);

      worker.onmessage = (msg) => {
        try {
          let formattedData = formatDates(msg.data);
          formattedData = validateRows(formattedData);
          formattedData = removeDuplicates(formattedData);
          setData(formattedData);
        } catch {
          setError("Error processing Excel file");
        } finally {
          setLoading(false);
          worker.terminate();
        }
      };
    };
    reader.readAsArrayBuffer(file);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = data.slice(startIndex, endIndex);

  // upload to backend
  const handleUploadToDB = async () => {
    try {
      const cleanedData = currentRows.map((row) => {
        const dbRow: DataRow = { ...row };
        if (dbRow.Hire_Date) {
          const hireDate = new Date(dbRow.Hire_Date);
          if (!isNaN(hireDate.getTime())) {
            dbRow.Hire_Date = hireDate.toISOString().split("T")[0];
          }
        }
        if (dbRow.Exit_Date) {
          const exitDate = new Date(dbRow.Exit_Date);
          if (!isNaN(exitDate.getTime())) {
            dbRow.Exit_Date = exitDate.toISOString().split("T")[0];
          }
        }
        return dbRow;
      });

      const chunkSize = 500;
      for (let i = 0; i < cleanedData.length; i += chunkSize) {
        const chunk = cleanedData.slice(i, i + chunkSize);
        await axios.post("http://localhost:5000/api/excel/uploadexcel", chunk);
      }
      alert("Data uploaded successfully");
    } catch (err) {
      console.error(err);
      setError("Error uploading data to server");
    }
  };


  return (
    <div>
      <h2>Excel File Upload</h2>
      <input type="file" onChange={handleFile} accept=".xlsx, .xls" />
      <button onClick={handleUploadToDB}>
        Upload to Database
      </button>
      {loading && <p>Processing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && data.length > 0 && (
        <>
          <table border={1} style={{ marginTop: 20, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {Object.keys(currentRows[0]).map((key) => (
                  <th key={key} style={{ padding: 5 }}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((value, j) => (
                    <td key={j} style={{ padding: 5 }}>
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {page + 1} of {Math.ceil(data.length / rowsPerPage)}
            </span>
            <button
              onClick={() =>
                setPage((p) =>
                  p + 1 < Math.ceil(data.length / rowsPerPage) ? p + 1 : p
                )
              }
              disabled={page + 1 >= Math.ceil(data.length / rowsPerPage)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExcelFileUpload;
