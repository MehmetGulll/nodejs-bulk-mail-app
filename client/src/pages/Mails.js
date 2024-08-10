import React, { useState, useEffect } from "react";
import axios from "axios";
import FormSection from "../components/FormSection";
import Swal from "sweetalert2";
import Button from "../components/Button";
import EmailsTable from "../components/EmailsTable";

function Mails() {
  const [newEmail, setNewEmail] = useState("");
  const [newSelectedName, setNewSelectedName] = useState("");
  const [categories, setCategories] = useState([]);

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

  return (
    <div>
      <div className="flex flex-col  mt-5 bg-white p-5 rounded-lg">
        <div className="w-1/4">
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

export default Mails;
