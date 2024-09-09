import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import Swal from "sweetalert2";
import Button from "./Button";
import {
  ToastNotification,
  showSuccessToast,
  showErrorToast,
} from "./ToastNotification";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useAuth } from "../Context/AuthContext";

function EmailsTable() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [newSelectedName, setNewSelectedName] = useState("");
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/getEmails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmails(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchEmails();
  }, [token]);

  useEffect(() => {
    const result = emails.filter(
      (email) =>
        email.email.toLowerCase().includes(filterText.toLowerCase()) &&
        (filterCategory === "" || email.name === filterCategory)
    );
    setFilteredEmails(result);
  }, [filterText, filterCategory, emails]);
  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      Swal.fire({
        title: "Oopss!",
        text: "Email kısmı boş kalamaz!",
        icon: "error",
      });
      return;
    } else {
      try {
        if (!newEmail || !newSelectedName) {
          Swal.fire({
            title: "Oopss!",
            text: "Email ve kategori adı gereklidir!",
            icon: "error",
          });
          return;
        }
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/addEmail`, {
          email: newEmail,
          name: newSelectedName,
        });
        Swal.fire({
          title: "Email Ekleme",
          text: "Email Başarıyla Eklendi!",
          icon: "success",
        });
        setNewEmail("");
        setNewSelectedName("");
      } catch (error) {
        console.error("Email eklerken hata oluştu:", error);
        Swal.fire({
          title: "Oopss!",
          text: "Email eklenirken bir hata oluştu!",
          icon: "error",
        });
      }
    }
  };

  const categories = [...new Set(emails.map((email) => email.name))];

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteEmail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmails(emails.filter((email) => email._id !== id));
      showSuccessToast("Email başarıyla silindi!");
    } catch (error) {
      console.log("Error deleting email", error);
      showErrorToast("Email silinirken bir hata oluştu.");
    }
  };

  const handleEdit = async (email) => {
    const { value: updatedEmail } = await Swal.fire({
      title: "E-posta Düzenleme",
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
            `${process.env.REACT_APP_API_URL}/updateEmail/${email._id}`,
            { email: newEmail },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return response.data.email;
        } catch (error) {
          Swal.showValidationMessage(
            `E-posta güncellenirken bir hata oluştu: ${
              error.response && error.response.data
                ? error.response.data.error
                : "Unknown error"
            }`
          );
          return null;
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

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Email", "Birim"]],
      body: filteredEmails.map((email) => [email.email, email.name]),
    });
    doc.save("emails.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEmails.map((email) => ({
        Email: email.email,
        Birim: email.name,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Emails");
    XLSX.writeFile(workbook, "emails.xlsx");
  };

  return (
    <div className="mt-5">
      <div className="flex justify-end space-x-2 mb-4">
        <div className="w-32">
          <Button onClick={exportPDF} text="PDF İndir" />
        </div>
        <div className="w-32">
          <Button onClick={exportExcel} text="Excel İndir" />
        </div>
      </div>
      <div className="flex flex-col gap-3 2xl:flex-row 2xl:justify-between p-3">
        <input
          type="text"
          placeholder="E mail Ara"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <select
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">Bütün Kategoriler</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Birim</th>
              <th className="px-4 py-2">Aksiyonlar</th>
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
      </div>

      <ToastNotification />
    </div>
  );
}

export default EmailsTable;
