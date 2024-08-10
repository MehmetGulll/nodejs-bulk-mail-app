import React, { useState, useEffect } from "react";
import FormSection from "../components/FormSection";
import EmailsTable from "../components/EmailsTable";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../components/Button";

function Home() {
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
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-row justify-around mt-5 bg-white justify-center p-5 rounded-lg">
        <div className="flex flex-col">
          <label>Dosya Yükle</label>
          <input
            type="file"
            onChange={handleFileChange}
            className=" rounded-md  mt-2"
          />
        </div>
        <div>
          <FormSection
            title="Gönderilecek olan birim"
            type="select"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            options={categories}
            buttonText="Gönder"
            buttonAction={handleSubmit}
          />
          <div className="mt-2">
            <Button text={"Gönder"} onClick={handleSubmit} />
          </div>
        </div>

        <div>
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

        <div>
          <FormSection
            title="Mail Ekleme"
            type="text"
            placeholder="E-mail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <FormSection
            title="Kategori Seçimi"
            type="select"
            value={newSelectedName}
            onChange={(e) => setNewSelectedName(e.target.value)}
            options={categories}
          />
          <div className="mt-2">
            <Button text={"Mail Ekle"} onClick={handleAddEmail} />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-5 mt-5">
        <EmailsTable />
      </div>
    </div>
  );
}

export default Home;
