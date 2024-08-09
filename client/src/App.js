import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FormSection from "./components/FormSection";
import axios from "axios";
import Swal from "sweetalert2";

function App() {
  const [selectedName, setSelectedName] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSelectedName, setNewSelectedName] = useState("");
  const [file, setFile] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getCategories");
        setCategories(response.data);
      } catch (error) {
        console.error("Kategorileri yüklerken hata oluştu:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleSubmit = async () => {
    console.log(selectedName);
    try {
      const response = await axios.post("http://localhost:8000/sendEmail", {
        name: selectedName,
      });
      Swal.fire({
        title: "Email Sending",
        text: "Email sent successfuly!",
        icon: "success",
      });
    } catch (error) {
      console.log("Error", error);
      Swal.fire({
        title: "Email Sending",
        text: "Email sent failed",
        icon: "error",
      });
    }
  };

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
        const response = await axios.post("http://localhost:8000/addEmail", {
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
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      Swal.fire({
        title: "Oopss!",
        text: "Lütfen bir dosya seçiniz!",
        icon: "error",
      });
      return;
    }

    setFile(selectedFile);
    await uploadFile(selectedFile);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/uploadFile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire({
        title: "Dosya Ekleme",
        text: "Dosya Başarıyla Eklendi!",
        icon: "success",
      });
      console.log(response.data);
    } catch (error) {
      console.error("Dosya yüklenirken hata oluştu:", error);
      Swal.fire({
        title: "Oopss!",
        text: "Dosya yüklenirken bir hata oluştu!",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col bg-layoutBackground">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mt-7">
          <Header />
        </div>
        <div className="flex flex-row justify-around mt-5 bg-white justify-center p-5 rounded-lg">
          <FormSection
            title="Gönderilecek olan birim"
            type="select"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            options={categories}
            buttonText="Gönder"
            buttonAction={handleSubmit}
          />
          <FormSection
            title="Kategori Ekleme"
            type="text"
            placeholder="Kategori Ekle"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            buttonText="Kategori Ekle"
            buttonAction={handleAddCategory}
          />
          <FormSection
            title="Mail Ekleme"
            type="text"
            placeholder="E-mail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            buttonText="Mail Ekle"
            buttonAction={handleAddEmail}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
