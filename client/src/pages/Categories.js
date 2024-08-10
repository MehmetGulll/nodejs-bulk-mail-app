import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import FormSection from "../components/FormSection";
import CategoriesTable from "../components/CategoriesTable";
import Swal from "sweetalert2";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Swal.fire({
        title: "Oopss!",
        text: "Kategori kısmı boş olamaz!",
        icon: "error",
      });
      return;
    } else {
      try {
        const response = await axios.post("http://localhost:8000/addCategory", {
          name: newCategory,
        });
        setCategories([...categories, response.data]);
        setNewCategory("");
        Swal.fire({
          title: "Kategori Ekleme",
          text: "Kategori Başarıyla Eklendi!",
          icon: "success",
        });
      } catch (error) {
        console.log("Error", error);
        Swal.fire({
          title: "Oopss!",
          text: "Kategori eklerken bir hata oluştu!",
          icon: "error",
        });
      }
    }
  };
  return (
    <div>
      <div className="flex flex-col mt-5 bg-white p-5 rounded-lg">
        <div className="w-1/4">
        <FormSection
          title="Kategori Ekleme"
          type="text"
          placeholder="Kategori Ekle"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <div className="mt-2">
          <Button text={"Kategori Ekle"} onClick={handleAddCategory} />
        </div>
        </div>
       
      </div>
      <div className="bg-white rounded-lg p-5 mt-5">
        <CategoriesTable />
      </div>
    </div>
  );
}
export default Categories;
