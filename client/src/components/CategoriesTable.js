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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/deleteCategory/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      showSuccessToast("Kategori başarıyla silindi!");  // Silme işlemi sonrası bildirim
    } catch (error) {
      console.log("Error deleting category", error);
      showErrorToast("Kategori silinirken bir hata oluştu.");
    }
  };

  const handleEdit = async (category) => {
    const { value: updatedCategoryName } = await Swal.fire({
      title: "Kategori düzenleme",
      input: "text",
      inputValue: category.name,  // category.name doğru bir şekilde input'a yerleştiriliyor
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Güncelle",
      showLoaderOnConfirm: true,
      preConfirm: async (newCategoryName) => {
        try {
          const response = await axios.put(
            `http://localhost:8000/updateCategory/${category._id}`,  // category._id olmalı
            { name: newCategoryName }  // Güncellenen kategori ismini gönderiyoruz
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
          item._id === category._id ? { ...item, name: updatedCategoryName } : item  // category.name güncelleniyor
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
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => (
            <tr key={index} className="bg-white">
              <td className="border px-4 py-2">{category.name}</td>
              <td className="border px-4 py-3 text-center ">
                <button
                  onClick={() => handleEdit(category)}  // category nesnesini gönderiyoruz
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
      <ToastNotification /> {/* Toast bildirimi için */}
    </div>
  );
}

export default CategoriesTable;
