import React, { useState, useEffect } from 'react';

  const sessions = [" ", "year_23_24", "year_24_25", "year_25_26", "year_26_27"];

  const DeletedReceipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [selectedSession, setSelectedSession] = useState(" ");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch deleted receipts from API endpoint
    const fetchDeletedReceipts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/Fees/fetchDeletedReceipts");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReceipts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching deleted receipts:', err);
        setError('Failed to fetch records.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchDeletedReceipts();
    }, []);

    // Filter receipts based on the selected session. If no session selected (value is blank), show all receipts.
    const filteredReceipts = selectedSession.trim() === "" 
      ? receipts 
      : receipts.filter(receipt => receipt.Session === selectedSession);

    return (
      <div className="p-4">

        {/* Session filter dropdown */}
        <div className="mb-4">
          <label htmlFor="sessionFilter" className="mr-2 font-medium">Filter by Session:</label>
          <select
            id="sessionFilter"
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="p-2 border rounded"
          >
            {sessions.map((session, index) => (
              <option key={index} value={session}>
                {session.trim() === "" ? "All" : session}
              </option>
            ))}
          </select>
        </div>

        {loading && <p>Loading receipts...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Receipts table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                {/* <th className="border p-2">Receipt ID</th> */}
                <th className="border p-2">Receipt No</th>
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Scholar No</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Session</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Mode of Pay</th>
                <th className="border p-2">Total Amt</th>
                <th className="border p-2">Deleted At</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.length ? (
                filteredReceipts.map((receipt, index) => (
                  <tr key={index} className="text-center">
                    {/* <td className="border p-2">{receipt.Receipt_ID}</td> */}
                    <td className="border p-2">{receipt.Receipt_No}</td>
                    <td className="border p-2">{receipt.student_name}</td>
                    <td className="border p-2">{receipt.Date}</td>
                    <td className="border p-2">{receipt.Scholar_No}</td>
                    <td className="border p-2">{receipt.Class}</td>
                    <td className="border p-2">{receipt.Session}</td>
                    <td className="border p-2">{receipt.Description}</td>
                    <td className="border p-2">{receipt.Mode_of_Pay}</td>
                    <td className="border p-2">{receipt.Total_Amt}</td>
                    <td className="border p-2">{receipt.Deleted_At}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="border p-2">
                    No receipts found for the selected session.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  export default DeletedReceipts;