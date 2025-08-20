import { format } from "date-fns";
import { DataRow } from "../types/dataTypes";

const REQUIRED_FIELDS = ["EEID", "Full_Name", "Department"];

// format Dates
export const formatDates = (rows: DataRow[]) => {
    const dateColumns = ["Hire_Date", "Exit_Date"];

    return rows.map((row) => {
        const formattedRow: DataRow = { ...row };
        dateColumns.forEach((col) => {
            if (formattedRow[col]) {
                try {
                    const value = formattedRow[col];
                    const dateValue =
                        typeof value === "number"
                            ? new Date((value - 25569) * 86400 * 1000)
                            : new Date(value as string);

                    formattedRow[col] = format(dateValue, "MM/dd/yyyy");
                } catch (e) {
                    console.warn(`Couldn't format date for column ${col}:`, row[col]);
                    formattedRow[col] = "Invalid date";
                }
            }
        });
        return formattedRow;
    });
};

// validate rows
export const validateRows = (rows: DataRow[]) => {
    return rows.filter((row) =>
        REQUIRED_FIELDS.every((field) => row[field] !== null && row[field] !== "")
    );
};

// remove duplicates based on EEID
export const removeDuplicates = (rows: DataRow[]) => {
    const seen = new Set<string>();
    const originalLength = rows.length;
    const filteredRows = rows.filter((row) => {
        const key = row.EEID;
        if (key && !seen.has(key)) {
            seen.add(key);
            return true;
        }
        return false;
    });
    const duplicatesRemoved = originalLength - filteredRows.length;
    alert(`Removed ${duplicatesRemoved} duplicate record(s).`);
    return filteredRows;
};
