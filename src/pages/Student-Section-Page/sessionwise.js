import React, { useState, useEffect, useRef } from 'react';

const SessionWise = () => {
  const [session, setSession] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const tableRef = useRef(null);

  const classOrder = [
    "Nur", "Kg1", "Kg2", "1st", "2nd", "3rd",
    "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"
  ];

  const sessions = [
    { value: "", label: "Select a session" },
    { value: "year_23_24", label: "2023-2024" },
    { value: "year_24_25", label: "2024-2025" },
    { value: "year_25_26", label: "2025-2026" },
    { value: "year_26_27", label: "2026-2027" },
  ];

  useEffect(() => {
    const fetchSessionWiseData = async () => {
      if (!session) return;

      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/Student-Section/GetStudentsList?session=${session}`);
        const data = await response.json();
        if (response.ok) {
          setStudents(data || []);
        } else {
          setError(data.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Network error');
      }
      setLoading(false);
    };

    fetchSessionWiseData();
  }, [session]);

  const totalBoys = students.filter(student => student.gender?.toLowerCase() === 'male').length;
  const totalGirls = students.filter(student => student.gender?.toLowerCase() === 'female').length;

  const sortedStudents = [...students].sort((a, b) => {
    const aClass = a[session] || '';
    const bClass = b[session] || '';

    const aIndex = classOrder.indexOf(aClass);
    const bIndex = classOrder.indexOf(bClass);

    if (aIndex === bIndex) {
      return a.student_name.localeCompare(b.student_name);
    }

    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const filteredStudents = sortedStudents.filter(student =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedRow(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <div className="mb-5 flex gap-10 items-center">
        <label htmlFor="session" className="mr-3 font-semibold">
          Session:
        </label>
        <select
          id="session"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="border p-2 rounded mr-5"
        >
          {sessions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {/* Display gender counts */}
        <div className="font-medium">
          <span className="mr-3">Boys: {totalBoys}</span>
          <span className='mr-3'>Girls: {totalGirls}</span>
          <span className=''>Total:  {totalGirls + totalBoys}</span>
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" px-4 py-1 border rounded"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && students.length > 0 && (
        <div ref={tableRef} className="">
          <table className="ttable-auto border-collapse w-full max-lg:text-[14px]">
            <thead>
              <tr className="bg-gray-200 border-b">
                <th className="border px-6 max-lg:px-2 py-2">S.No</th>
                <th className="border px-6 max-lg:px-3 py-2 whitespace-nowrap">Scholar No</th>
                <th className="border px-20 max-lg:px-14 py-2">Name</th>
                <th className="border px-12 max-lg:px-8 py-2">DOB</th>
                <th className="border px-6 max-lg:px-2 py-2">Gender</th>
                <th className="border px-6 py-2 whitespace-nowrap">Contact No</th>
                <th className="border px-6 py-2 whitespace-nowrap">WhatsApp No</th>
                <th className="border px-16 max-lg:px-10 py-2 whitespace-nowrap">Father Name</th>
                <th className="border px-16 max-lg:px-10 py-2 whitespace-nowrap">Mother Name</th>
                <th className="border px-6 py-2">Class</th>
                <th className="border px-6 py-2 whitespace-nowrap">Admission Date</th>
                <th className="border px-56 max-lg:px-28 py-2 whitespace-nowrap">Address</th>
                <th className="border px-6 py-2 whitespace-nowrap">Samagra ID</th>
                <th className="border px-6 py-2 whitespace-nowrap">Family ID</th>
                <th className="border px-6 py-2">Cast</th>
                <th className="border px-6 py-2 whitespace-nowrap">Aadhar Number</th>
                <th className="border px-16 max-lg:px-8 py-2 whitespace-nowrap">Name on Aadhar</th>
                <th className="border px-6 py-2 whitespace-nowrap">Previous Class</th>
                <th className="border px-6 py-2 whitespace-nowrap">Admission Under</th>
                <th className="border px-6 py-2 whitespace-nowrap">Admission Year</th>
                <th className="border px-6 py-2 whitespace-nowrap">Bank Account</th>
                <th className="border px-6 py-2 whitespace-nowrap">IFSC Code</th>
                <th className="border px-72 max-lg:px-60 py-2">Photo</th>
                <th className="border px-72 max-lg:px-60 py-2">Document</th>
                <th className="border px-6 py-2">year_23_24</th>
                <th className="border px-6 py-2">year_24_25</th>
                <th className="border px-6 py-2">year_25_26</th>
                <th className="border px-6 py-2">year_26_27</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.scholar_no}
                  className={`border-b text-center cursor-pointer ${selectedRow === student.scholar_no ? 'bg-blue-100 font-bold' : ''
                    }`}
                  onClick={() => setSelectedRow(student.scholar_no)}
                >
                  <td className="border px-0 py-0">{index + 1}</td>
                  <td className="border px-0 py-0">{student.scholar_no}</td>
                  <td className="border px-0 py-0">{student.student_name}</td>
                  <td className="border px-0 py-0">{student.dob}</td>
                  <td className="border px-0 py-0">{student.gender}</td>
                  <td className="border px-0 py-0">{student.contact_no}</td>
                  <td className="border px-0 py-0">{student.whatsapp_no}</td>
                  <td className="border px-0 py-0">{student.father_name}</td>
                  <td className="border px-0 py-0">{student.mother_name}</td>
                  <td className="border px-0 py-0">{student.admission_class}</td>
                  <td className="border px-0 py-0">{student.admission_date}</td>
                  <td className="border px-0 py-0">{student.address}</td>
                  <td className="border px-0 py-0">{student.samagra_id}</td>
                  <td className="border px-0 py-0">{student.family_id}</td>
                  <td className="border px-0 py-0">{student.cast}</td>
                  <td className="border px-0 py-0">{student.aadhar_number}</td>
                  <td className="border px-0 py-0">{student.name_on_aadhar}</td>
                  <td className="border px-0 py-0">{student.previous_class}</td>
                  <td className="border px-0 py-0">{student.admission_under}</td>
                  <td className="border px-0 py-0">{student.admission_year}</td>
                  <td className="border px-0 py-0">{student.bank_account}</td>
                  <td className="border px-0 py-0">{student.ifsc_code}</td>
                  <td className="border px-0 py-0">{student.photo}</td>
                  <td className="border px-0 py-0">{student.document}</td>
                  <td className="border px-0 py-0">{student.year_23_24}</td>
                  <td className="border px-0 py-0">{student.year_24_25}</td>
                  <td className="border px-0 py-0">{student.year_25_26}</td>
                  <td className="border px-0 py-0">{student.year_26_27}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !error && students.length === 0 && (
        <p className="text-center">No data available</p>
      )}
    </div>
  );
};

export default SessionWise;