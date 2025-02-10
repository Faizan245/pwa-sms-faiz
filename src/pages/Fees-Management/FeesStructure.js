import React, { useState, useEffect } from "react";

const IndividualFees = () => {
  const sessions = [" ", "year_23_24", "year_24_25", "year_25_26", "year_26_27"];
  const grades = [
    "Nur",
    "Kg1",
    "Kg2",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
  ];
  const feeTypes = [
    "Admission_Fees",
    "Tution_Fees",
    "Activity_Fees",
    "Management_Fees",
    "Exam_Fees",
    "Other_Fees",
    "Total_Fees",
    "Emi_1",
    "Emi_2",
    "Emi_3",
    "Emi_4",
  ];

  const [Session, setSession] = useState("");
  const [feesData, setFeesData] = useState(initializeEmptyFeesData());
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  // Initialize feesData structure dynamically
  function initializeEmptyFeesData() {
    const emptyData = {};
    feeTypes.forEach((feeType) => {
      emptyData[feeType] = {};
      grades.forEach((grade) => {
        emptyData[feeType][grade] = ""; // Initialize each cell as empty
      });
    });
    return emptyData;
  }

  // Fetch data based on Session
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/Fees/FetchFeesStructure?Session=${Session}`);
        const rawData = await response.json();

        if (!rawData || typeof rawData !== "object") {
          throw new Error("Invalid data format");
        }

        const transformedData = initializeEmptyFeesData();

        Object.keys(rawData).forEach((key) => {
          const parts = key.split("_");
          if (parts.length >= 3) {
            const [feeType, grade] = [parts[0] + "_" + parts[1], parts[2]];
            transformedData[feeType][grade] = rawData[key].toString();
          }
        });

        setFeesData(transformedData);
        console.log("Fees data fetched:", transformedData);
      } catch (error) {
        console.error("Error fetching fees data:", error);
        setFeesData(initializeEmptyFeesData());
      } finally {
        setIsLoading(false);
        setIsDataSubmitted(false);
      }
    };

    if (Session) {
      fetchData();
    }
  }, [Session, isDataSubmitted]);

  // Handle input changes in cells
  const handleCellChange = (feeType, grade, value) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // Ensure only numbers are input
    setFeesData((prev) => {
      const updatedFeesData = {
        ...prev,
        [feeType]: {
          ...prev[feeType],
          [grade]: numericValue,
        },
      };

      // Calculate total fees for the grade
      const totalFees = ["Admission_Fees", "Tution_Fees", "Activity_Fees", "Management_Fees", "Exam_Fees", "Other_Fees"]
        .map((type) => Number(updatedFeesData[type][grade] || 0))
        .reduce((sum, value) => sum + value, 0);

      updatedFeesData["Total_Fees"][grade] = totalFees.toString();

      return updatedFeesData;
    });
  };

  // Submit updated data
  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      // Transform the feesData into the required API structure
      const transformedFeesData = {};
      Object.keys(feesData).forEach((feeType) => {
        Object.keys(feesData[feeType]).forEach((grade) => {
          const key = `${feeType}_${grade}`;
          transformedFeesData[key] = feesData[feeType][grade] ? Number(feesData[feeType][grade]) : 0;
        });
      });

      // Add the session to the request body
      const payload = {
        Session,
        ...transformedFeesData,
      };
      console.log("Submitting fees data:", payload);

      // Send the API request
      const response = await fetch("/api/Fees/SubmitFeesStructure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error updating fees data");
      }

      alert("Fees structure updated successfully!");
      setIsDataSubmitted(true);
      
    } catch (error) {
      console.error("Error updating fees data:", error);
      alert(error.message || "Error updating fees data");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="">
      {/* Session Selector */}
      <div className="mb-2 flex items-center gap-3">
        <label className="block mb-1 font-medium">Session</label>
        <select
          value={Session}
          onChange={(e) => setSession(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {sessions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table with horizontal scrolling */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-md">
          <thead>
            <tr className="text-center bg-gray-300 border-b">
              <th className="border border-gray-500 font-semibold w-[24%] px-4 py-1">Fee Type</th>
              {grades.map((grade) => (
                <th key={grade} className="border border-gray-500 font-semibold px-2 py-1">
                  {grade}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feeTypes.map((feeType) => (
              <tr key={feeType} className="text-center">
                <td className="border border-gray-300   py-1 font-medium">
                  {feeType.replace(/_/g, " ")}
                </td>
                {grades.map((grade) => (
                  <td key={grade} className="border border-gray-300  whitespace-nowrap px-0.5 py-1">
                    <input
                      type="text"
                      value={feesData[feeType][grade] || ""}
                      onChange={(e) => handleCellChange(feeType, grade, e.target.value)}
                      className="w-full border border-gray-300 rounded text-center px-0.5 py-0.5"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-900 text-white px-6 py-1 rounded-2xl disabled:bg-gray-400"
          disabled={isUpdating}
        >
          {isUpdating ? "Submitting..." : "Submit"}
        </button>
        <button
          onClick={() => alert("Print functionality not implemented yet.")}
          className="bg-gradient-to-r from-gray-400 to-gray-700 hover:from-gray-500 hover:to-gray-900 text-white px-6 py-1 rounded-2xl"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default IndividualFees;