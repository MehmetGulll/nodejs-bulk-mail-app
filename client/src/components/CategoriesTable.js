import React, { useState, useEffect } from "react";
import axios from "axios";

function CategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getCategories");
        setCategories(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const result = categories.filter((category) =>
      category.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredCategories(result);
  }, [filterText, categories]);

  return (
    <div className="mt-5">
      <div className="flex justify-between p-3">
        <input
          type="text"
          placeholder="Filter by category name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border p-2"
        />
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Category Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => (
            <tr key={index} className="bg-white">
              <td className="border px-4 py-2">{category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoriesTable;
