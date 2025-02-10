"use client";
import React, { useState, useEffect } from "react";

const YearWiseData = () => {
  const [session, setSession] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [boysCount, setBoysCount] = useState(0);
  const [girlsCount, setGirlsCount] = useState(0);

  const sessions = [" ", "2022", "2023", "2024", "2025", "2026"];

  // Fetch data when session changes
  useEffect(() => {
    const fetchYearWiseData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `/api/Admission/FetchAdmission?admission_year=${session}`
        );
        const data = await response.json();
        if (response.ok) {
          setStudents(data);
          setFilteredStudents(data); // Initially set filtered students to all students
          setStudentCount(data.length);

          // Count boys and girls
          const boys = data.filter((student) => student.gender === "Male").length;
          const girls = data.filter((student) => student.gender === "Female").length;
          setBoysCount(boys);
          setGirlsCount(girls);
        } else {
          setError(data.error || "Failed to fetch data");
        }
      } catch (err) {
        setError("Network error");
      }
      setLoading(false);
    };

    if (session) {
      fetchYearWiseData();
    }
  }, [session]);

  // Filter students based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students); // Show all students if search query is empty
    } else {
      const filtered = students.filter((student) =>
        student.student_name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);


  return (
    <div className="max-xl:text-[14px]">
      <div className="mb-5 flex flex-wrap justify-center gap-y-4">
        <label htmlFor="session" className="mr-3 font-semibold">
          Session:
        </label>
        <select
          id="session"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="border px-2 rounded"
        >
          {sessions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <span className="ml-5 font-semibold">
          Total Students: {studentCount}
        </span>
        <span className="ml-5 font-semibold text-blue-500">
          Boys: {boysCount}
        </span>
        <span className="ml-5 font-semibold text-pink-500">
          Girls: {girlsCount}
        </span>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-5 border px-2 rounded"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="table-auto border-collapse w-full max-lg:text-[14px]">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="border px-6 max-lg:px-1 py-2">S.No</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Scholar No</th>
              <th className="border px-20 max-lg:px-16 py-2">Name</th>
              <th className="border px-12 py-2">DOB</th>
              <th className="border px-6 max-lg:px-3 py-2">Gender</th>
              <th className="border px-6 max-lg:px-3 py-2 whitespace-nowrap">Contact No</th>
              <th className="border px-16 max-lg:px-6 py-2 whitespace-nowrap">Father Name</th>
              <th className="border px-16 max-lg:px-6 py-2 whitespace-nowrap">Mother Name</th>
              <th className="border px-6 max-lg:px-1 py-2">Class</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Admission Date</th>
              <th className="border px-56 max-lg:px-28 py-2 whitespace-nowrap">Address</th>
              <th className="border px-6 max-lg:px-3 py-2 whitespace-nowrap">Samagra ID</th>
              <th className="border px-6 max-lg:px-3 py-2 whitespace-nowrap">Family ID</th>
              <th className="border px-6 max-lg:px-3 py-2">Cast</th>
              <th className="border px-6 max-lg:px-3 py-2 whitespace-nowrap">Aadhar Number</th>
              <th className="border px-16 max-lg:px-10 py-2 whitespace-nowrap">Name on Aadhar</th>
              <th className="border px-6 max-lg:px-3 py-2 whitespace-nowrap">WhatsApp No</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Previous Class</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Admission Under</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Admission Year</th>
              <th className="border px-6 max-lg:px-6 py-2 whitespace-nowrap">Bank Account</th>
              <th className="border px-6 max-lg:px-5 py-2 whitespace-nowrap">IFSC Code</th>
              <th className="border px-72 max-lg:px-62 py-2">Photo</th>
              <th className="border px-72 max-lg:px-62 py-2">Document</th>
              <th className="border px-6 max-lg:px-4 py-2">year_23_24</th>
              <th className="border px-6 max-lg:px-4 py-2">year_24_25</th>
              <th className="border px-6 max-lg:px-4 py-2">year_25_26</th>
              <th className="border px-6 max-lg:px-4 py-2">year_26_27</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.scholar_no} className="border-b text-center">
                <td className="border">{index + 1}</td>
                <td className="border">{student.scholar_no}</td>
                <td className="border">{student.student_name}</td>
                <td className="border">{student.dob}</td>
                <td className="border">{student.gender}</td>
                <td className="border">{student.contact_no}</td>
                <td className="border">{student.father_name}</td>
                <td className="border">{student.mother_name}</td>
                <td className="border">{student.admission_class}</td>
                <td className="border">{student.admission_date}</td>
                <td className="border">{student.address}</td>
                <td className="border">{student.samagra_id}</td>
                <td className="border">{student.family_id}</td>
                <td className="border">{student.cast}</td>
                <td className="border">{student.aadhar_number}</td>
                <td className="border">{student.name_on_aadhar}</td>
                <td className="border">{student.whatsapp_no}</td>
                <td className="border">{student.previous_class}</td>
                <td className="border">{student.admission_under}</td>
                <td className="border">{student.admission_year}</td>
                <td className="border">{student.bank_account}</td>
                <td className="border">{student.ifsc_code}</td>
                <td className="border">{student.photo}</td>
                <td className="border">{student.document}</td>
                <td className="border">{student.year_23_24}</td>
                <td className="border">{student.year_24_25}</td>
                <td className="border">{student.year_25_26}</td>
                <td className="border">{student.year_26_27}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default YearWiseData;
