import { useEffect, useState } from "react";

const parseDate = (dateStr) => {
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
  }
  return new Date(dateStr);
};

const Accounts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch("/api/Fees/FetchAllFeesReceipts");
        if (!response.ok) {
          throw new Error("Failed to fetch receipts");
        }
        const data = await response.json();
        setReceipts(data.receipts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  useEffect(() => {
    if (filter !== "between-dates") {
      setFromDate("");
      setToDate("");
    }
    if (filter !== "date-wise") {
      setSelectedDate("");
    }
    if (filter !== "session-wise") {
      setSelectedSession("");
    }
  }, [filter]);

  const getFilteredReceipts = () => {
    const today = new Date();
    return receipts.filter((receipt) => {
      const receiptDate = parseDate(receipt.Date);
      if (filter === "today") {
        return receiptDate.toDateString() === today.toDateString();
      } else if (filter === "month") {
        return (
          receiptDate.getMonth() === today.getMonth() &&
          receiptDate.getFullYear() === today.getFullYear()
        );
      } else if (filter === "date-wise" && selectedDate) {
        return receiptDate.toDateString() === new Date(selectedDate).toDateString();
      } else if (filter === "between-dates" && fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        return receiptDate >= from && receiptDate <= to;
      } else if (filter === "session-wise" && selectedSession) {
        return receipt.Session === selectedSession;
      }
      return true;
    });
  };
  // Aggregation calculations (fixing function call issue)
const filteredReceipts = getFilteredReceipts();

const totalAmount = filteredReceipts.reduce((sum, acc) => sum + Number(acc.Total_Amt || 0), 0);
const totalCash = filteredReceipts.reduce((sum, acc) => acc.Mode_of_Pay === "Cash" ? sum + Number(acc.Total_Amt || 0) : sum, 0);
const totalOnline = filteredReceipts.reduce((sum, acc) => acc.Mode_of_Pay === "Online" ? sum + Number(acc.Total_Amt || 0) : sum, 0);

  return (
    <div className="relative p-6 bg-gray-100">
      <div className="flex gap-10 items-center">
        <div className="mb-4">
          <label htmlFor="filter" className="mr-2">Filter Receipts:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All Receipts</option>
            <option value="today">Today's Receipts</option>
            <option value="month">This Month's Receipts</option>
            <option value="date-wise">Date Wise Receipts</option>
            <option value="between-dates">Between Dates Wise Receipts</option>
            <option value="session-wise">Session Wise Receipts</option>
          </select>
        </div>

        {filter === "date-wise" && (
          <div className="mb-4">
            <label htmlFor="date" className="mr-2">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        )}

        {filter === "between-dates" && (
          <div className="mb-4 flex gap-4">
            <div>
              <label htmlFor="from-date" className="mr-2">From:</label>
              <input
                type="date"
                id="from-date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="to-date" className="mr-2">To:</label>
              <input
                type="date"
                id="to-date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}

        {filter === "session-wise" && (
          <div className="mb-4">
            <label htmlFor="session" className="mr-2">Select Session:</label>
            <select
              id="session"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Select Session</option>
              <option value="year_23_24">Year 23-24</option>
              <option value="year_24_25">Year 24-25</option>
              <option value="year_25_26">Year 25-26</option>
              <option value="year_26_27">Year 26-27</option>
            </select>
          </div>
        )}
      </div>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-center">Receipt No</th>
                <th className="p-3 text-center">Student Name</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Scholar No</th>
                <th className="p-3 text-center">Class</th>
                <th className="p-3 text-center">Session</th>
                <th className="p-3 text-center">Description</th>
                <th className="p-3 text-center">Mode of Pay</th>
                <th className="p-3 text-center">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredReceipts().map((receipt, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-1 text-center">{receipt.Receipt_No}</td>
                  <td className="p-1 text-center">{receipt.student_name}</td>
                  <td className="p-1 text-center">{receipt.Date}</td>
                  <td className="p-1 text-center">{receipt.Scholar_No}</td>
                  <td className="p-1 text-center">{receipt.Class}</td>
                  <td className="p-1 text-center">{receipt.Session}</td>
                  <td className="p-1 text-center">{receipt.Description}</td>
                  <td className="p-1 text-center">{receipt.Mode_of_Pay}</td>
                  <td className="p-1 text-center font-semibold">₹{receipt.Total_Amt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="fixed bottom-0 right-0 w-full bg-gray-100 border-t p-4 flex justify-center gap-10">
        <div>
          <strong>Total Amount:</strong> {totalAmount}
        </div>
        <div>
          <strong>Total Cash:</strong> {totalCash}
        </div>
        <div>
          <strong>Total Online:</strong> {totalOnline}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
