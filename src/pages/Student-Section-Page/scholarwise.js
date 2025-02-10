import React, { useState, useEffect, useRef } from 'react';

const ScholarWise = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchAllStudents = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/Student-Section/GetStudentsList');
        const data = await response.json();
        if (response.ok) {
          // Sort students in descending order based on scholar_no
          const sortedData = data.sort((a, b) => b.scholar_no - a.scholar_no);
          setStudents(sortedData);
        } else {
          setError(data.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Network error');
      }
      setLoading(false);
    };

    fetchAllStudents();
  }, []);

  // Search filter function
  useEffect(() => {
    const filtered = students.filter(student =>
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  // Count boys and girls based on gender
  const boysCount = students.filter(student => student.gender === 'Male').length || 0;
  const girlsCount = students.filter(student => student.gender === 'Female').length || 0;

  // Click outside to reset selected row
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
    <div className="p-4">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className='flex gap-10 items-center'>
            {/* Gender Count Section */}
            <div className="mb-4 flex gap-6 text-lg font-semibold">
              <p>Total Boys: <span className="text-blue-600">{boysCount}</span></p>
              <p>Total Girls: <span className="text-pink-600">{girlsCount}</span></p>
            </div>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 px-4 py-1 border rounded"
            />
          </div>

          {/* Students Table */}
          <div ref={tableRef} className="">
            <table className="table-auto border-collapse w-full max-lg:text-[14px]">
              <thead>
                <tr className="bg-gray-200 border-b">
                  <th className="border px-6 py-2">S.No</th>
                  <th className="border px-6 py-2 whitespace-nowrap">Scholar No</th>
                  <th className="border px-20 py-2">Name</th>
                  <th className="border px-12 py-2">DOB</th>
                  <th className="border px-6 py-2">Gender</th>
                  <th className="border px-6 py-2 whitespace-nowrap">Contact No</th>
                  <th className="border px-16 py-2 whitespace-nowrap">Father Name</th>
                  <th className="border px-16 py-2 whitespace-nowrap">Mother Name</th>
                  <th className="border px-6 py-2">Class</th>
                  <th className="border px-6 py-2 whitespace-nowrap">Admission Date</th>
                  <th className="border px-56 py-2">Address</th>
                  <th className="border px-6 py-2 whitespace-nowrap">Samagra ID</th>
                  <th className="border px-6 py-2 whitespace-nowrap">Family ID</th>
                  <th className="border px-6 py-2">Cast</th>
                  <th className="border px-6 py-2 whitespace-nowrap">Aadhar Number</th>
                  <th className="border px-16 py-2 whitespace-nowrap">Name on Aadhar</th>
                  <th className="border px-6 py-2 whitespace-nowrap">WhatsApp No</th>
                  <th className="border px-6 py-2 whitespace-nowrap">Previous Class</th>
                  <th className="border px-6 py-2 whitespace-nowrap">Admission Under</th>
                  <th className="border px-6 py-2 whitespace-nowrap">Admission Year</th>
                  <th className="border px-6 py-2 whitespace-nowrap">Bank Account</th>
                  <th className="border px-6 py-2 whitespace-nowrap">IFSC Code</th>
                  <th className="border px-72 py-2">Photo</th>
                  <th className="border px-72 py-2">Document</th>
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
                    <td className="border px-2 py-1">{index + 1}</td>
                    <td className="border px-2 py-1">{student.scholar_no}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{student.student_name}</td>
                    <td className="border px-2 py-1">{student.dob}</td>
                    <td className="border px-2 py-1">{student.gender}</td>
                    <td className="border px-2 py-1">{student.contact_no}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{student.father_name}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{student.mother_name}</td>
                    <td className="border px-2 py-1">{student.admission_class}</td>
                    <td className="border px-2 py-1">{student.admission_date}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{student.address}</td>
                    <td className="border px-2 py-1">{student.samagra_id}</td>
                    <td className="border px-2 py-1">{student.family_id}</td>
                    <td className="border px-2 py-1">{student.cast}</td>
                    <td className="border px-2 py-1">{student.aadhar_number}</td>
                    <td className="border px-2 py-1">{student.name_on_aadhar}</td>
                    <td className="border px-2 py-1">{student.whatsapp_no}</td>
                    <td className="border px-2 py-1">{student.previous_class}</td>
                    <td className="border px-2 py-1">{student.admission_under}</td>
                    <td className="border px-2 py-1">{student.admission_year}</td>
                    <td className="border px-2 py-1">{student.bank_account}</td>
                    <td className="border px-2 py-1">{student.ifsc_code}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{student.photo}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{student.document}</td>
                    <td className="border px-2 py-1">{student.year_23_24}</td>
                    <td className="border px-2 py-1">{student.year_24_25}</td>
                    <td className="border px-2 py-1">{student.year_25_26}</td>
                    <td className="border px-2 py-1">{student.year_26_27}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ScholarWise;
