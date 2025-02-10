import React, { useState, useEffect, useCallback } from "react";
  import DepositFeesModal from "./DepositFeesModal";
  import Success from "../successDailogue/Success";
  import { RiDeleteBin6Line } from "react-icons/ri";

  const IndividualFees = () => {
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

    const [students, setStudents] = useState([]);
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedScholarNo, setSelectedScholarNo] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [warning, setWarning] = useState("");
    const [feeRecords, setFeeRecords] = useState([]);
    const [totalFees, setTotalFees] = useState(0);
    const [feeDeposited, setFeeDeposited] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [studentFeesID, setStudentFeesID] = useState("");

    // State variables to handle deletion modal functionality
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showSecurityInput, setShowSecurityInput] = useState(false);
    const [securityKey, setSecurityKey] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // New state variables for discount security modal
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [discountSecurityKey, setDiscountSecurityKey] = useState("");

    // Consolidated API call function
    // Updated fetchData function that handles 304 status code by returning a default value.
    const fetchData = useCallback(async (url, setDataCallback, errorMessage) => {
      try {
        const response = await fetch(url);
        // Check for 304 Not Modified
        if (response.status === 304) {
          setDataCallback([]);
          return;
        }
        if (!response.ok) {
          if (response.status === 404) {
            console.warn(`${errorMessage}: No data found (404).`);
          } else {
            console.warn(`${errorMessage}: HTTP error! Status: ${response.status}`);
          }
          setDataCallback([]);
          return;
        }
        const text = await response.text();
        const data = text.length ? JSON.parse(text) : {};
        setDataCallback(data);
      } catch (error) {
        console.error(`${errorMessage}: Unexpected error`, error);
        setDataCallback([]);
      }
    }, []);

    // Fetch students when session and grade are selected.
    useEffect(() => {
      if (selectedSession && selectedGrade) {
        const url = `/api/Student-Section/FetchStudentID?Session=${selectedSession}&Class=${selectedGrade}`;
        fetchData(
          url,
          (data) => {
            if (data.students && Array.isArray(data.students)) {
              const studentList = data.students.map(
                (student) => `${student.scholar_no}_${student.student_name}`
              );
              setStudents(studentList);
            } else {
              setStudents([]);
            }
          },
          "Error fetching student data:"
        );
      }
    }, [selectedSession, selectedGrade, fetchData]);

    // When a student is selected, fetch total fees and discount once.
    useEffect(() => {
      if (selectedScholarNo && selectedGrade && selectedSession) {
        setDiscount(0);
        const totalFeesUrl = `/api/Fees/FetchTotalFees?Session=${selectedSession}&Class=${selectedGrade}`;
        fetchData(
          totalFeesUrl,
          (data) => {
            if (data.totalFees) {
              setTotalFees(Number(data.totalFees));
            }
          },
          "Error fetching total fees:"
        );

        const receiptId = `${selectedSession}_${selectedGrade}_${selectedScholarNo}`;
        const discountUrl = `/api/Fees/FetchDiscount?studentFeesID=${receiptId}`;
        fetchData(
          discountUrl,
          (data) => {
            if (data.discount) {
              setDiscount(Number(data.discount));
            }
          },
          "Error fetching discount:"
        );
      }
    }, [selectedScholarNo, selectedGrade, selectedSession, fetchData]);

    // Fetch fee receipts whenever student details change.
    useEffect(() => {
      if (selectedScholarNo && selectedGrade && selectedSession) {
        loadFeeReceipts();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedScholarNo, selectedGrade, selectedSession]);

    // Modified loadFeeReceipts returns the total deposited amount.
    const loadFeeReceipts = async () => {
      if (selectedScholarNo && selectedGrade && selectedSession) {
        const receiptId = `${selectedSession}_${selectedGrade}_${selectedScholarNo}`;
        setFeeDeposited(0);
        try {
          const response = await fetch(
            `/api/Fees/FetchFeesReceipt?receiptId=${receiptId}`
          );
          if (!response.ok) {
            console.warn(`Error fetching fee receipts: HTTP ${response.status}`);
            setFeeRecords([]);
            return 0;
          }
          const data = await response.json();
          const records = Array.isArray(data) ? data : [];
          setFeeRecords(records);

          const installmentRecords = records.filter(
            (record) => record.Description === "Fees Installment" || record.Description === "RTE"
          );
          

          // Calculate total deposited for filtered records
          const totalDepositedLocal = installmentRecords.reduce(
            (sum, record) => sum + parseFloat(record.Total_Amt || 0),
            0
          );
          setFeeDeposited(totalDepositedLocal);
          return totalDepositedLocal;
        } catch (error) {
          console.error("Unexpected error fetching fee receipts", error);
          setFeeRecords([]);
          return 0;
        }
      }
      return 0;
    };

    // Updated insertOrUpdateFeesDetail that accepts updated deposited value.
    const insertOrUpdateFeesDetail = async (updatedDeposited) => {
      const usedDeposited = updatedDeposited !== undefined ? updatedDeposited : feeDeposited;
      const receiptId = `${selectedSession}_${selectedGrade}_${selectedScholarNo}`;
      const updatedRemaining = totalFees - discount - usedDeposited;
      const feesDetailData = {
        studentFeesID: receiptId,
        scholarNo: selectedScholarNo,
        studentName: selectedStudent,
        totalFees: totalFees,
        discount: discount,
        deposited: usedDeposited,
        remaining: updatedRemaining,
      };
      try {
        const response = await fetch("/api/Fees/InsertOrUpdateFeesDetail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feesDetailData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error in fee details API: ${errorData.message}`);
          return;
        }
        await response.json();
      } catch (error) {
        alert("Network error during insert/update fee details");
      }
    };

    // Sequential fee deposit processing.
    // 1. Submit fee receipt.
    // 2. Reload fee receipts and capture updated deposited fee.
    // 3. Insert or update fee details using the fresh values.
    const handleFeeDeposit = async (formData) => {
      setStudentFeesID(formData.receiptId);
      try {
        const response = await fetch("/api/Fees/SubmitFeesReceipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setShowSuccess(true);
          const updatedDeposited = await loadFeeReceipts();
          await insertOrUpdateFeesDetail(updatedDeposited);
          setTimeout(() => {
            setShowSuccess(false);
          }, 1500);
          return { success: true };
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        alert("Network error during fee deposit");
      }
    };

    // Function to perform discount API call after security key verification.
    const submitDiscount = async () => {
      const receiptId = `${selectedSession}_${selectedGrade}_${selectedScholarNo}`;
      const formData = {
        studentFeesID: receiptId,
        discount: discount,
        remaining: remaining,
      };
      try {
        const response = await fetch("/api/Fees/ApplyDiscount", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        setShowSuccess(true);
        await response.json();
        setTimeout(() => {
          setShowSuccess(false);
        }, 1500);
        return { success: true };
      } catch (error) {
        console.error("Failed to apply discount:", error);
        alert("Please add receipts first before applying discount");
        setDiscount(0);
      }
    };

    // Handler for discount security key submission.
    const handleDiscountSecurityKeySubmit = async () => {
      if (discountSecurityKey !== "123456") {
        alert("Entered key was incorrect");
        return;
      }
      // Key is valid, close discount modal and proceed.
      setShowDiscountModal(false);
      setDiscountSecurityKey("");
      await submitDiscount();
    };

    // Helper function to reset state on session or grade change.
    const resetStudentSelection = () => {
      setSelectedStudent("");
      setSelectedScholarNo("");
      setStudents([]);
      setFeeRecords([]);
      setDiscount(0);
      setRemaining(0);
      setFeeDeposited(0);
      setTotalFees(0);
    };

    const handleSessionChange = (sessionValue) => {
      setSelectedSession(sessionValue);
      resetStudentSelection();
    };

    const handleGradeChange = (grade) => {
      setSelectedGrade(grade);
      resetStudentSelection();
    };

    const handleDepositClick = () => {
      if (!selectedSession || !selectedGrade || !selectedStudent) {
        setWarning("Please select session, class, and student before proceeding.");
      } else {
        setIsModalOpen(true);
      }
    };

    // Update remaining fee when totalFees, discount, or feeDeposited changes.
    useEffect(() => {
      setRemaining(totalFees - discount - feeDeposited);
    }, [totalFees, discount, feeDeposited]);

    // Delete receipt functionality
    const handleDeleteClick = (receipt) => {
      setSelectedReceipt(receipt);
      setIsDeleteModalOpen(true);
      setShowSecurityInput(false);
      setSecurityKey("");
      setErrorMessage("");
    };

    const handleCancelDelete = () => {
      setIsDeleteModalOpen(false);
      setSelectedReceipt(null);
      setShowSecurityInput(false);
      setSecurityKey("");
      setErrorMessage("");
    };

    const handleConfirmDelete = () => {
      setShowSecurityInput(true);
    };

    const handleSecurityKeySubmit = async () => {
      if (securityKey !== "123456") {
        setErrorMessage("Wrong security key!");
        setTimeout(() => {
          setIsDeleteModalOpen(false);
          setErrorMessage("");
        }, 2000);
        return;
      }
      try {
        const response = await fetch("/api/Fees/DeleteReceipt", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receiptNo: selectedReceipt.Receipt_No }),
        });
        if (response.ok) {
          await loadFeeReceipts();
          setIsDeleteModalOpen(false);
        } else {
          setErrorMessage("Delete API failed.");
          setTimeout(() => {
            setIsDeleteModalOpen(false);
            setErrorMessage("");
          }, 2000);
        }
      } catch (error) {
        console.error("Error deleting receipt", error);
        setErrorMessage("Error deleting receipt.");
        setTimeout(() => {
          setIsDeleteModalOpen(false);
          setErrorMessage("");
        }, 2000);
      }
    };

    return (
      <div className="p-1 flex flex-col max-lg:text-[14px]">
        <div>
          <div className="flex flex-wrap items-center justify-center gap-4 max-lg:gap-1 mb-5 max-sm:mb-2">
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium">Session</label>
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

            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium">Class</label>
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

            <div className="flex items-center gap-0">
              <label className="block text-sm font-medium w-52">
                Student Name
              </label>
              <select
                id="student"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                onChange={(e) => {
                  setFeeRecords([]);
                  setTotalFees(0);
                  setDiscount(0);
                  setFeeDeposited(0);
                  const [scholarNo, name] = e.target.value.split("_");
                  setSelectedStudent(name);
                  setSelectedScholarNo(scholarNo);
                }}
              >
                <option value="">Select Student</option>
                {students.map((student) => {
                  const [id, name] = student.split("_");
                  return (
                    <option key={id} value={student}>
                      {student}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="h-[400px] max-md:h-[340px] overflow-y-scroll mb-6">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-200 border-b text-center">
                  <th className="border border-gray-300 px-4 max-sm:px-1 py-2 whitespace-nowrap">
                    Receipt No.
                  </th>
                  <th className="border border-gray-300 px-4 max-sm:px-1 py-2">Date</th>
                  <th className="border border-gray-300 px-4 max-sm:px-1 py-2">Description</th>
                  <th className="border border-gray-300 px-4 max-sm:px-1 py-2 whitespace-nowrap">
                    Mode of Pay
                  </th>
                  <th className="border border-gray-300 px-4 max-sm:px-1 py-2">Amount</th>
                  <th className="border border-gray-300 px-1 max-sm:px-1 py-2 whitespace-nowrap">
                    Delete Receipt
                  </th>
                </tr>
              </thead>
              <tbody>
                {feeRecords && feeRecords.length > 0 ? (
                  feeRecords.map((record, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-4 max-sm:px-1 py-2">
                        {record.Receipt_No || ""}
                      </td>
                      <td className="border border-gray-300 px-4 max-sm:px-1 py-2 whitespace-nowrap">
                        {record.Date || ""}
                      </td>
                      <td className="border border-gray-300 px-4 max-sm:px-1 whitespace-nowrap py-2">
                        {record.Description || ""}
                      </td>
                      <td className="border border-gray-300 px-4 max-sm:px-1 py-2">
                        {record.Mode_of_Pay || ""}
                      </td>
                      <td className="border border-gray-300 px-4 max-sm:px-1 py-2">
                        {record.Total_Amt || ""}
                      </td>
                      <td className="border border-gray-300 px-1 max-sm:px-1 py-2">
                        <button
                          title="Delete this reciept"
                          className="hover:scale-125 text-red-500"
                          onClick={() => handleDeleteClick(record)}
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center border border-gray-300 px-4 py-2"
                    >
                      No record found for the selected student. Please deposit fees to check receipts.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-[400px]">
              {!showSecurityInput ? (
                <div>
                  <p className="mb-4">
                    Do you really want to delete this Receipt?
                  </p>
                  <table className="table-auto border-collapse border border-gray-300 my-2 w-full">
                    <thead>
                      <tr className="bg-gray-200 border-b text-center">
                        <th className="border border-gray-300 px-4 max-sm:px-1 py-2 whitespace-nowrap">Receipt_No</th>
                        <th className="border border-gray-300 px-4 max-sm:px-1 py-2 whitespace-nowrap">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="border border-gray-300 px-4 max-sm:px-1 py-2">{selectedReceipt.Receipt_No}</td>
                        <td className="border border-gray-300 px-4 max-sm:px-1 py-2">{selectedReceipt.Total_Amt}</td>
                      </tr>
                    </tbody>
                  </table>
                  <h1 className="text-red-500">
                    <strong>Warning : </strong>Please confirm the Reciept_No before deleting...
                  </h1>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={handleCancelDelete}
                    >
                      No
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={handleConfirmDelete}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-4">Please enter the 6-digit security key:</p>
                  <input
                    type="password"
                    className="w-full border border-gray-300 p-2 mb-4"
                    value={securityKey}
                    maxLength="6"
                    onChange={(e) => setSecurityKey(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={handleCancelDelete}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={handleSecurityKeySubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              {errorMessage && (
                <p className="mt-4 text-red-500">{errorMessage}</p>
              )}
            </div>
          </div>
        )}

        {/* New Discount Security Modal */}
        {showDiscountModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-[400px]">
              <p className="mb-4">Please enter the 6-digit discount security key:</p>
              <input
                type="password"
                className="w-full border border-gray-300 p-2 mb-4"
                value={discountSecurityKey}
                maxLength="6"
                onChange={(e) => setDiscountSecurityKey(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowDiscountModal(false);
                    setDiscountSecurityKey("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={handleDiscountSecurityKeySubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex gap-y-2 justify-center space-x-4 max-sm:space-x-1 mb-6">
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium">Total Fees</label>
              <input
                type="text"
                value={totalFees}
                className="border border-gray-300 rounded text-center p-2 max-md:p-1 w-full"
                disabled
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium">Discount</label>
              <input
                type="text"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="border border-gray-300 rounded text-center p-2 max-md:p-1 w-full"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium">Deposited</label>
              <input
                type="text"
                value={feeDeposited}
                className="border border-gray-300 rounded text-center p-2 max-md:p-1 w-full"
                disabled
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium">Remaining</label>
              <input
                type="text"
                value={remaining}
                className="border border-gray-300 rounded text-center p-2 max-md:p-1 w-full"
                disabled
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-y-2 justify-center space-x-4">
            <button className="bg-green-500 text-white px-4 py-2 max-md:py-1 rounded">
              Send Receipt on WA
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 max-md:py-1 rounded"
              type="button"
              onClick={() => setShowDiscountModal(true)}
            >
              Apply Discount
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 max-md:py-1 rounded"
              onClick={handleDepositClick}
            >
              Deposit Fees
            </button>
          </div>
          <DepositFeesModal
            key={Date.now()}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onDeposit={(formDataToSubmit) => handleFeeDeposit(formDataToSubmit)}
            studentName={selectedStudent}
            scholarNo={selectedScholarNo}
            grade={selectedGrade}
            session={selectedSession}
          />
          {warning && (
            <div className="mt-4 text-center text-red-600 text-sm font-medium">
              {warning}
            </div>
          )}
        </div>
        {showSuccess && <Success />}
      </div>
    );
  };

  export default IndividualFees;