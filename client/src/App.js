import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [selectedName, setSelectedName] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSelectedName, setNewSelectedName] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getCategories");
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
      const response = await axios.post("http://localhost:5000/sendEmail", {
        name: selectedName,
      });
      alert("Email sent successfully!");
    } catch (error) {
      console.log("Error", error);
      alert("Email sent failed", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert("Kategori adı boş bırakılamaz!");
      return;
    } else {
      try {
        const response = await axios.post("http://localhost:5000/addCategory", {
          name: newCategory,
        });
        setCategories([...categories, response.data]);
        setNewCategory("");
        alert("Kategori eklendi");
      } catch (error) {
        console.log("Error", error);
        alert("Kategori eklenirken hata oluştu");
      }
    }
  };
  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      alert("Email boş bırakılamaz!");
      return;
    } else {
      try {
        if (!newEmail || !newSelectedName) {
          alert("E-posta ve kategori adı gereklidir.");
          return;
        }
        const response = await axios.post("http://localhost:5000/addEmail", {
          email: newEmail,
          name: newSelectedName,
        });
        alert("Email başarıyla eklendi!");
        setNewEmail("");
        setNewSelectedName("");
      } catch (error) {
        console.error("Email eklerken hata oluştu:", error);
        alert("Email eklerken hata oluştu");
      }
    }
  };
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      alert("Lütfen bir dosya seçin.");
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
        "http://localhost:5000/uploadFile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Dosya başarıyla yüklendi!");
      console.log(response.data);
    } catch (error) {
      console.error("Dosya yüklenirken hata oluştu:", error);
      alert("Dosya yüklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <h1 className="text-4xl">Bulk Mail App</h1>
      </div>
      <div className="flex flex-row justify-around mt-5">
        <div className="mt-5 flex flex-col">
          <div>Gönderilecek olan birim</div>
          <div className="mt-2">
            <select
              className="border-2 border-slate-700 rounded-md px-5"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
            >
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col mt-2">
            <input type="file" onChange={handleFileChange} accept="image/*" />

          </div>
          <div>
            <button
              onClick={handleSubmit}
              className="mt-5 border-2 px-8 border-slate-700 rounded-md px-5"
            >
              Gönder
            </button>
          </div>
        </div>
        <div className="mt-5 flex flex-col">
          <div>Kategori Ekleme</div>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Kategori Ekle"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border-2 border-slate-700 rounded-md px-5"
            />
          </div>
          <div className="mt-5">
            <button
              className="border-2 px-8 border-slate-700 rounded-md px-5"
              onClick={handleAddCategory}
            >
              Kategori Ekle
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-col">
          <div>Mail Ekleme</div>
          <div className="mt-2">
            <input
              type="text"
              placeholder="E-mail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border-2 border-slate-700 rounded-md px-5"
            />
          </div>
          <div className="mt-2">
            <select
              className="border-2 border-slate-700 rounded-md px-5"
              value={selectedName}
              onChange={(e) => setNewSelectedName(e.target.value)}
            >
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-5">
            <button
              className="border-2 px-8 border-slate-700 rounded-md px-5"
              onClick={handleAddEmail}
            >
              Mail Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
