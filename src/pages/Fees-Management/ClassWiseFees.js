"use client";
import { useState, useEffect } from "react";

const sessions = [
  { label: "Select Session", value: "" },
  { label: "2023-2024", value: "year_23_24" },
  { label: "2024-2025", value: "year_24_25" },
  { label: "2025-2026", value: "year_25_26" },
  { label: "2026-2027", value: "year_26_27" },
];

const grades = [
  "Select Class",
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

const ClassWiseFees = () => {
  const [session, setSession] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [feesDetails, setFeesDetails] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  const [familyIdSortOrder, setFamilyIdSortOrder] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [discountSortOrder, setDiscountSortOrder] = useState(null)
  const [depositedSortOrder, setDepositedSortOrder] = useState(null);
  const [remainingSortOrder, setRemainingSortOrder] = useState(null);


  const handleRowClick = (studentId) => {
    setSelectedRow(studentId);
  };

  useEffect(() => {
    if (session && studentClass) {
      fetchFeesData(true);
    } else if (session) {
      fetchFeesData(false);
    }
  }, [session, studentClass]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredData(feesDetails);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredData(
        feesDetails.filter((student) =>
          student.Student_Name.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [search, feesDetails]);

  const fetchFeesData = async (isClassSelected) => {
    setLoading(true);
    try {
      if (isClassSelected) {
        await fetch("/api/Fees/InsertFeesDetailsForClass", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session, class: studentClass }),
        });
      }

      const url = isClassSelected
        ? `/api/Fees/FetchFeesDetail?session=${session}&class=${studentClass}`
        : `/api/Fees/FetchFeesDetail?session=${session}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.feesDetails) {
        setFeesDetails(data.feesDetails);
        setFilteredData(data.feesDetails);
      } else {
        setFeesDetails([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching fees details:", error);
    }
    setLoading(false);
  };

  // const handleSortByName = () => {
  //   let sortedData = [...filteredData];
  //   if (sortOrder === "asc") {
  //     sortedData.sort((a, b) => b.Student_Name.localeCompare(a.Student_Name));
  //     setSortOrder("desc");
  //   } else {
  //     sortedData.sort((a, b) => a.Student_Name.localeCompare(b.Student_Name));
  //     setSortOrder("asc");
  //   }
  //   setFilteredData(sortedData);
  // };

  // const handleSortByFamilyId = () => {
  //   let sortedData = [...filteredData];
  //   if (familyIdSortOrder === "asc") {
  //     sortedData.sort((a, b) => b.Family_ID - a.Family_ID);
  //     setFamilyIdSortOrder("desc");
  //   } else {
  //     sortedData.sort((a, b) => a.Family_ID - b.Family_ID);
  //     setFamilyIdSortOrder("asc");
  //   }
  //   setFilteredData(sortedData);
  // };

  const handleCombinedSort = (sortBy) => {
    let sortedData = [...filteredData];
    if (sortBy === "name") {
      if (sortOrder === "asc") {
        sortedData.sort((a, b) => b.Student_Name.localeCompare(a.Student_Name));
        setSortOrder("desc");
      } else {
        sortedData.sort((a, b) => a.Student_Name.localeCompare(b.Student_Name));
        setSortOrder("asc");
      }
    } else if (sortBy === "familyId") {
      if (familyIdSortOrder === "asc") {
        sortedData.sort((a, b) => b.Family_ID - a.Family_ID);
        setFamilyIdSortOrder("desc");
      } else {
        sortedData.sort((a, b) => a.Family_ID - b.Family_ID);
        setFamilyIdSortOrder("asc");
      }
    } else if (sortBy === "discount") {
      if (discountSortOrder === "asc") {
        sortedData.sort((a, b) => b.Discount - a.Discount);
        setDiscountSortOrder("desc");
      } else {
        sortedData.sort((a, b) => a.Discount - b.Discount);
        setDiscountSortOrder("asc");
      }
    }
    else if (sortBy === "deposited") {
      if (depositedSortOrder === "asc") {
        sortedData.sort((a, b) => b.Deposited - a.Deposited);
        setDepositedSortOrder("desc");
      } else {
        sortedData.sort((a, b) => a.Deposited - b.Deposited);
        setDepositedSortOrder("asc");
      }
    } else if (sortBy === "remaining") {
      if (remainingSortOrder === "asc") {
        sortedData.sort((a, b) => b.Remaining - a.Remaining);
        setRemainingSortOrder("desc");
      } else {
        sortedData.sort((a, b) => a.Remaining - b.Remaining);
        setRemainingSortOrder("asc");
      }
    }
    setFilteredData(sortedData);
  };

  return (
    <div className="w-full mx-auto bg-white shadow-md rounded-lg">
      <div className="w-full flex flex-col items-center">
        <div className="flex w-[60%] gap-4 mb-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Session</label>
            <select
              className="w-full mt-1 border border-gray-300 p-1 rounded-lg"
              value={session}
              onChange={(e) => {
                const selectedSession = e.target.value;
                setSession(selectedSession);
                setStudentClass("");
                if (!selectedSession) {
                  setFeesDetails([]);
                  setFilteredData([]);
                }
              }}
            >
              {sessions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select
              className="w-full mt-1 border border-gray-300 p-1 rounded-lg"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              disabled={!session}
            >
              {grades.map((g) => (
                <option key={g} value={g === "Select Class" ? "" : g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              placeholder="Search by Student Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mt-1 border border-gray-300 p-1 rounded-lg"
            />
          </div>
        </div>
        {loading ? (
          <p className="h-[450px]">Loading...</p>
        ) : (
          <div className="overflow-x-auto overflow-y-scroll w-full h-[450px] overflow-y-scroll px-2">
            <table className="w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 whitespace-nowrap">Scholar No</th>
                  {!studentClass && <th className="border px-4 py-2">Class</th>}
                  <th className="border px-4 py-2 cursor-pointer whitespace-nowrap" onClick={() => handleCombinedSort("name")}>Student Name</th>
                  <th className="border px-4 py-2 cursor-pointer whitespace-nowrap" onClick={() => handleCombinedSort("familyId")}>Family ID</th>
                  <th className="border px-4 py-2 whitespace-nowrap">Contact No</th>
                  <th className="border px-4 py-2 whitespace-nowrap">WhatsApp No</th>
                  <th className="border px-4 py-2 whitespace-nowrap">Total Fees</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => handleCombinedSort("discount")}>Discount</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => handleCombinedSort("deposited")}>Deposited</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => handleCombinedSort("remaining")}>Remaining</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((student) => (
                  <tr
                    key={student.StudentFeesID}
                    className={`text-center cursor-pointer ${selectedRow === student.StudentFeesID ? "bg-blue-100 font-semibold" : "bg-white"
                      }`}
                    onClick={() => handleRowClick(student.StudentFeesID)}
                  >
                    <td className="border px-4 py-2">{student.Scholar_No}</td>
                    {!studentClass && (
                      <td className="border px-4 py-2">
                        {student.StudentFeesID.split("_")[3]}
                      </td>
                    )}
                    <td className="border px-4 py-2">{student.Student_Name}</td>
                    <td className="border px-4 py-2">{student.Family_ID}</td>
                    <td className="border px-4 py-2">{student.contact_no}</td>
                    <td className="border px-4 py-2">{student.whatsapp_no}</td>
                    <td className="border px-4 py-2">{student.Total_Fees}</td>
                    <td className="border px-4 py-2">{student.Discount}</td>
                    <td className="border px-4 py-2">{student.Deposited}</td>
                    <td className="border px-4 py-2">{student.Remaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Summary Block */}
      <div className="w-full flex justify-end  bg-gray-50 py-2 pr-8 rounded-lg">
        <div className="flex gap-10 text-center">
          {/* <div className="bg-gray-200 p-1  rounded">
            <h3 className="font-semibold">Total Fees</h3>
            <p className="text-sm">
              {filteredData.reduce((sum, student) => sum + (student.Total_Fees || 0), 0)}
            </p>
          </div> */}
          <div className="bg-gray-200 p-1  rounded">
            <h3 className="font-semibold">Discount</h3>
            <p className="text-sm">
              {filteredData.reduce((sum, student) => sum + (student.Discount || 0), 0)}
            </p>
          </div>
          <div className="bg-gray-200 p-1  rounded">
            <h3 className="font-semibold">Deposited</h3>
            <p className="text-sm">
              {filteredData.reduce((sum, student) => sum + (student.Deposited || 0), 0)}
            </p>
          </div>
          <div className="bg-gray-200 p-1  rounded">
            <h3 className="font-semibold">Remaining</h3>
            <p className="text-sm">
              {filteredData.reduce((sum, student) => sum + (student.Remaining || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassWiseFees;