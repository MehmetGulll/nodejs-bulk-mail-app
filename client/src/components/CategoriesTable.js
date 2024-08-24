import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import Swal from "sweetalert2";
import {
  ToastNotification,
  showSuccessToast,
  showErrorToast,
} from "./ToastNotification";
import { useAuth } from "../Context/AuthContext";

function CategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filterText, setFilterText] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/getCategories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [token]);

  useEffect(() => {
    const result = categories.filter((category) =>
      category.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredCategories(result);
  }, [filterText, categories]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteCategory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((category) => category._id !== id));
      showSuccessToast("Kategori başarıyla silindi!");
    } catch (error) {
      console.log("Error deleting category", error);
      showErrorToast("Kategori silinirken bir hata oluştu.");
    }
  };

  const handleEdit = async (category) => {
    const { value: updatedCategoryName } = await Swal.fire({
      title: "Kategori düzenleme",
      input: "text",
      inputValue: category.name,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Güncelle",
      showLoaderOnConfirm: true,
      preConfirm: async (newCategoryName) => {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/updateCategory/${category._id}`,
            { name: newCategoryName },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return response.data;
        } catch (error) {
          Swal.showValidationMessage(`
            Kategori güncellenirken bir hata oluştu: ${error.response.data.error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (updatedCategoryName) {
      setCategories(
        categories.map((item) =>
          item._id === category._id
            ? { ...item, name: updatedCategoryName }
            : item
        )
      );
      showSuccessToast("Kategori başarıyla güncellendi!");
    }
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between p-3">
        <input
          type="text"
          placeholder="Birim Ara"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border p-2"
        />
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Birim Adı</th>
            <th className="px-4 py-2">Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => (
            <tr key={index} className="bg-white">
              <td className="border px-4 py-2">{category.name}</td>
              <td className="border px-4 py-3 text-center ">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="text-[#FF6F61] hover:text-red-500   ml-5"
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

export default CategoriesTable;
