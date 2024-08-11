import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import Swal from 'sweetalert2'
import {
  ToastNotification,
  showSuccessToast,
  showErrorToast,
} from "./ToastNotification"; 

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/deleteEmail/${id}`);
      setEmails(emails.filter((email) => email._id !== id));
      showSuccessToast("Email başarıyla silindi!");
    } catch (error) {
      console.log("Error deleting email", error);
      showErrorToast("Email silinirken bir hata oluştu.");
    }
  };
  const handleEdit = async (email) => {
    const { value: updatedEmail } = await Swal.fire({
      title: "E-posta düzenleme",
      input: "text",
      inputValue: email.email,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Güncelle",
      showLoaderOnConfirm: true,
      preConfirm: async (newEmail) => {
        try {
          const response = await axios.put(
            `http://localhost:8000/updateEmail/${email._id}`,
            { email: newEmail }
          );
          return response.data;
        } catch (error) {
          Swal.showValidationMessage(`
            E-posta güncellenirken bir hata oluştu: ${error.response.data.error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (updatedEmail) {
      setEmails(
        emails.map((item) =>
          item._id === email._id ? { ...item, email: updatedEmail } : item
        )
      );
      showSuccessToast("Email başarıyla güncellendi!");
    }
  };
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
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmails.map((email, index) => (
            <tr key={index} className="bg-white">
              <td className="border px-4 py-2">{email.email}</td>
              <td className="border px-4 py-2">{email.name}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEdit(email)}
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(email._id)}
                  className="text-[#FF6F61] hover:text-red-500 ml-5"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastNotification />
    </div>
  );
}

export default EmailsTable;
