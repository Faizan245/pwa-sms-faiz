import React, { useState, useEffect } from 'react';
  import PrintReceiptModal from './PrintReceiptModal';
  import Image from 'next/image';

  const Receipt = () => {
    // Static data for sessions and grades
    const sessions = [
      { label: " ", value: "" },
      { label: "2023-2024", value: "year_23_24" },
      { label: "2024-2025", value: "year_24_25" },
      { label: "2025-2026", value: "year_25_26" },
      { label: "2026-2027", value: "year_26_27" },
    ];

    const grades = [
      "",
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

    // Component states
    const [students, setStudents] = useState([]);
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedScholarNo, setSelectedScholarNo] = useState("");
    const [feeRecords, setFeeRecords] = useState([]);
    // New state to handle modal receipt data
    const [selectedReceiptData, setSelectedReceiptData] = useState(null);

    // Reset student selection when session or grade is changed
    const resetStudentSelection = () => {
      setSelectedStudent("");
      setSelectedScholarNo("");
      setFeeRecords([]);
      setStudents([]);
    };

    // Handle the session change and trigger student list fetch if possible
    const handleSessionChange = (sessionValue) => {
      setSelectedSession(sessionValue);
      resetStudentSelection();
    };

    // Handle the grade change and trigger student list fetch if possible
    const handleGradeChange = (gradeValue) => {
      setSelectedGrade(gradeValue);
      resetStudentSelection();
    };

    // Fetch students when both session and grade are selected.
    useEffect(() => {
      const fetchStudents = async () => {
        if (selectedSession && selectedGrade) {
          try {
            const response = await fetch(
              `/api/Student-Section/FetchStudentID?Session=${selectedSession}&Class=${selectedGrade}`
            );
            if (response.ok) {
              const data = await response.json();
              // Ensure that the received data is an array.
              if (data.students && Array.isArray(data.students)) {
                const studentList = data.students.map(
                  (student) => `${student.scholar_no}_${student.student_name}`
                );
                setStudents(studentList);
              } else {
                console.error("Received data is not an array:", data);
                setStudents([]);
              }
            } else {
              console.error("Failed to fetch students: ", response.statusText);
              setStudents([]);
            }
          } catch (error) {
            console.error("Error fetching students: ", error);
            setStudents([]);
          }
        }
      };

      fetchStudents();
    }, [selectedSession, selectedGrade]);

    // Function to fetch fee records for a given receiptId.
    const fetchFeeRecords = async (receiptId) => {
      try {
        const response = await fetch(
          `/api/Fees/FetchFeesReceipt?receiptId=${receiptId}`
        );
        if (response.ok) {
          const data = await response.json();
          // Assuming API returns an array of fee record objects.
          setFeeRecords(data);
        } else {
          console.error("Failed to fetch fee records: ", response.statusText);
          setFeeRecords([]);
        }
      } catch (error) {
        console.error("Error fetching fee records: ", error);
        setFeeRecords([]);
      }
    };

    // Handle student selection and trigger fee record fetch
    const handleStudentChange = (e) => {
      setFeeRecords([]);
      const selectedValue = e.target.value;
      if (!selectedValue) return;
      // Expected format "scholarNo_studentName"
      const [scholarNo, name] = selectedValue.split("_");
      setSelectedStudent(name);
      setSelectedScholarNo(scholarNo);
      setSelectedReceiptData(null);
      // Build receiptId and fetch fee records.
      const receiptId = `${selectedSession}_${selectedGrade}_${scholarNo}`;
      fetchFeeRecords(receiptId);
    };

    // Handle row click in fee records table to open modal and set receipt data.
    // Updated to correctly map record fields to the keys expected in PrintReceiptModal.
    const handleRowClick = (record) => {
      const receiptData = {
        receiptNo: record.Receipt_No || "",
        date: record.Date || "",
        description: record.Description || "",
        modeOfPay: record.Mode_of_Pay || "",
        totalAmt: record.Total_Amt || "",
        Amt_Words: record.Amt_Words || "",
        // Additional details passed from current state.
        studentName: selectedStudent,
        scholarNo: selectedScholarNo,
        session: selectedSession,
        grade: selectedGrade,
      };
      setSelectedReceiptData(receiptData);
    };

    return (
      <div className="flex gap-10 max-xl:gap-2 max-sm:text-[14px] justify-between max-lg:flex-col w-full h-full">
        <div className="w-full h-full">
          <div className="w-full">
            <div className="flex justify-center max-sm:flex-wrap gap-2 mb-5 max-sm:mb-2">
              <div className="flex items-center gap-2">
                <label htmlFor="session" className="block text-sm font-medium">
                  Session
                </label>
                <select
                  id="session"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  value={selectedSession}
                  onChange={(e) => handleSessionChange(e.target.value)}
                >
                  {sessions.map((session, index) => (
                    <option key={index} value={session.value}>
                      {session.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="grade" className="block text-sm font-medium">
                  Class
                </label>
                <select
                  id="grade"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  value={selectedGrade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                >
                  {grades.map((grade, index) => (
                    <option key={index} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center  gap-0">
                <label htmlFor="student" className="block text-sm font-medium w-full">
                  Student Name
                </label>
                <select
                  id="student"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  onChange={handleStudentChange}
                  value={selectedStudent ? `${selectedScholarNo}_${selectedStudent}` : " "}
                >
                  <option value=" ">Select Student</option>
                  {students.map((student, index) => {
                    // Assuming student is in "scholarNo_studentName" format.
                    const [id, name] = student.split("_");
                    return (
                      <option key={id || index} value={student}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="w-full flex justify-center max-sm:justify-start overflow-x-scroll mb-6">
              <table className="table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 border-b text-center">
                    <th className="border border-gray-300 px-1 py-2 whitespace-nowrap">
                      Receipt No.
                    </th>
                    <th className="border border-gray-300 px-1 py-2">Date</th>
                    <th className="border border-gray-300 px-1 py-2">
                      Description
                    </th>
                    <th className="border border-gray-300 px-1 py-2 whitespace-nowrap">
                      Mode of Pay
                    </th>
                    <th className="border border-gray-300 px-1 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {feeRecords && feeRecords.length > 0 ? (
                    feeRecords.map((record, index) => (
                      <tr
                        key={index}
                        className="text-center cursor-pointer hover:bg-gray-100"
                        onClick={() => handleRowClick(record)}
                      >
                        <td className="border border-gray-300 px-1 py-2">
                          {record.Receipt_No || ""}
                        </td>
                        <td className="border border-gray-300 px-1 py-2 whitespace-nowrap">
                          {record.Date || ""}
                        </td>
                        <td className="border border-gray-300 px-1 py-2 whitespace-nowrap">
                          {record.Description || ""}
                        </td>
                        <td className="border border-gray-300 px-1 py-2">
                          {record.Mode_of_Pay || ""}
                        </td>
                        <td className="border border-gray-300 px-1 py-2">
                          {record.Total_Amt || ""}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center border border-gray-300 px-1 py-2">
                        No record found for the selected student. Please deposit fees to check receipts.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center h-full">
          <PrintReceiptModal receiptData={selectedReceiptData} />
        </div>
      </div>
    );
  };

  export default Receipt;