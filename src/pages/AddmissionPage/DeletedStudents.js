"use client";
import React, { useState, useEffect } from "react";

const DeletedStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [boysCount, setBoysCount] = useState(0);
  const [girlsCount, setGirlsCount] = useState(0);


  // Fetch data when session changes
  useEffect(() => {
    const fetchYearWiseData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `/api/Admission/GetDeletedAdmissions`
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

    fetchYearWiseData();

  }, []);

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
      <div className="mb-5 flex flex-wrap justify-center gap-y-4  ">
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
        <table className="table-auto border-collapse w-full max-xl:text-[14px]">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="border px-6 max-lg:px-1 py-2">S.No</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Scholar No</th>
              <th className="border px-20 max-lg:px-16 py-2">Name</th>
              <th className="border px-12 py-2">DOB</th>
              <th className="border px-6 max-lg:px-1 py-2">Gender</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Contact No</th>
              <th className="border px-16 max-lg:px-6 py-2 whitespace-nowrap">Father Name</th>
              <th className="border px-16 max-lg:px-6 py-2 whitespace-nowrap">Mother Name</th>
              <th className="border px-6 max-lg:px-1 py-2">Class</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Admission Date</th>
              <th className="border px-56 max-lg:px-20 py-2 whitespace-nowrap">Address</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Samagra ID</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Family ID</th>
              <th className="border px-6 max-lg:px-1 py-2">Cast</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Aadhar Number</th>
              <th className="border px-16 max-lg:px-10 py-2 whitespace-nowrap">Name on Aadhar</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">WhatsApp No</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Previous Class</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Admission Under</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Admission Year</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">Bank Account</th>
              <th className="border px-6 max-lg:px-1 py-2 whitespace-nowrap">IFSC Code</th>
              <th className="border px-72 max-lg:px-56 py-2">Photo</th>
              <th className="border px-72 max-lg:px-56 py-2">Document</th>
              <th className="border px-6 max-lg:px-4 py-2">year_23_24</th>
              <th className="border px-6 max-lg:px-4 py-2">year_24_25</th>
              <th className="border px-6 max-lg:px-4 py-2">year_25_26</th>
              <th className="border px-6 max-lg:px-4 py-2">year_26_27</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.scholar_no} className="border-b text-center">
                <td className="border px-4 py-0">{index + 1}</td>
                <td className="border px-4 py-0">{student.scholar_no}</td>
                <td className="border px-4 py-0">{student.student_name}</td>
                <td className="border px-4 py-0">{student.dob}</td>
                <td className="border px-4 py-0">{student.gender}</td>
                <td className="border px-4 py-0">{student.contact_no}</td>
                <td className="border px-4 py-0">{student.father_name}</td>
                <td className="border px-4 py-0">{student.mother_name}</td>
                <td className="border px-4 py-0">{student.admission_class}</td>
                <td className="border px-4 py-0">{student.admission_date}</td>
                <td className="border px-4 py-0">{student.address}</td>
                <td className="border px-4 py-0">{student.samagra_id}</td>
                <td className="border px-4 py-0">{student.family_id}</td>
                <td className="border px-4 py-0">{student.cast}</td>
                <td className="border px-4 py-0">{student.aadhar_number}</td>
                <td className="border px-4 py-0">{student.name_on_aadhar}</td>
                <td className="border px-4 py-0">{student.whatsapp_no}</td>
                <td className="border px-4 py-0">{student.previous_class}</td>
                <td className="border px-4 py-0">{student.admission_under}</td>
                <td className="border px-4 py-0">{student.admission_year}</td>
                <td className="border px-4 py-0">{student.bank_account}</td>
                <td className="border px-4 py-0">{student.ifsc_code}</td>
                <td className="border px-4 py-0">{student.photo}</td>
                <td className="border px-4 py-0">{student.document}</td>
                <td className="border px-4 py-0">{student.year_23_24}</td>
                <td className="border px-4 py-0">{student.year_24_25}</td>
                <td className="border px-4 py-0">{student.year_25_26}</td>
                <td className="border px-4 py-0">{student.year_26_27}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeletedStudents;
