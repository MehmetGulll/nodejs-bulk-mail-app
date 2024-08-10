import React, { useState, useEffect } from "react";
import axios from "axios";

function EmailsTable() {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getEmails");
        setEmails(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchEmails();
  }, [emails]);
  useEffect(() => {
    const result = emails.filter(
      (email) =>
        email.email.toLowerCase().includes(filterText.toLowerCase()) &&
        (filterCategory === "" || email.name === filterCategory)
    );
    setFilteredEmails(result);
  }, [filterText, filterCategory, emails]);
  const categories = [...new Set(emails.map((email) => email.name))];
  return (
    <div className="mt-5">
      <div className="flex justify-between p-3">
        <input
          type="text"
          placeholder="Filter by email"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <select
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Birim</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmails.map((email, index) => (
            <tr key={index} className="bg-white">
              <td className="border px-4 py-2">{email.email}</td>
              <td className="border px-4 py-2">{email.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmailsTable;
