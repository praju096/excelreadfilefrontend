/* eslint-disable no-restricted-globals */
import * as XLSX from "xlsx";

self.onmessage = (event) => {
  try {
    const fileData = event.data;
    const workbook = XLSX.read(fileData, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: false,
    });

    postMessage(jsonData);
  } catch (error) {
    postMessage({ error: "Failed to parse Excel file" });
  }
};
