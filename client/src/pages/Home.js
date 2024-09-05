import React, { useState, useEffect } from "react";
import FormSection from "../components/FormSection";
import EmailsTable from "../components/EmailsTable";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../components/Button";
import { GoGear } from "react-icons/go";
import { useAuth } from "../Context/AuthContext";
import {
  ToastNotification,
  showSuccessToast,
  showErrorToast,
} from "../components/ToastNotification";

function Home() {
  const [selectedName, setSelectedName] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSelectedName, setNewSelectedName] = useState("");
  const [file, setFile] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getCategories`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCategories(response.data);
        if(response.data.length > 0 && !newSelectedName){
          setNewSelectedName(response.data[0].name);
          setSelectedName(response.data[0].name);
        }
      } catch (error) {
        console.error("Kategorileri yüklerken hata oluştu:", error);
      }
    };
  
    fetchCategories();
  }, [token]); 
  
  const handleSubmit = async () => {
    console.log("Selected Name:", selectedName);
    showSuccessToast("Emails are being sent...");
    try {
      const response = await axios.post(
       `${process.env.REACT_APP_API_URL}/sendEmail`,
        {
          name: selectedName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        title: "Email Sending",
        text: "Email sent successfuly!",
        icon: "success",
      });
    } catch (error) {
      console.log("Error", error);
      Swal.fire({
        title: "Email Sending",
        text: "Email sent failed, Check to your SMTP setting" + error.message,
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
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/addCategory`,
          {
            name: newCategory,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
    console.log("mail",newEmail);
    console.log("kategori",newSelectedName);
    if (!newEmail.trim()) {
      Swal.fire({
        title: "Oopss!",
        text: "Email kısmı boş kalamaz!",
        icon: "error",
      });
      return;
    } else {
      try {
        
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/addEmail`,
          {
            email: newEmail,
            name: newSelectedName,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
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
        `${process.env.REACT_APP_API_URL}/uploadFile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
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
  
  
  const handleSMTPClick = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Enter SMTP Settings",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Host">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Port">' +
        '<input id="swal-input3" class="swal2-input" placeholder="User">' +
        '<input id="swal-input4" class="swal2-input" type="password" placeholder="Password">' +
        '<input id="swal-input5" class="swal2-input" placeholder="From Email">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          host: document.getElementById("swal-input1").value,
          port: document.getElementById("swal-input2").value,
          user: document.getElementById("swal-input3").value,
          password: document.getElementById("swal-input4").value,
          fromEmail: document.getElementById("swal-input5").value,
        };
      },
      confirmButtonText: "Submit",
      showCancelButton: true,
    });

    if (formValues) {
      try {
        const response = await axios.post(
          "http://localhost:8000/setupSmtp",
          formValues,{
            headers:{
              'Authorization':`Bearer ${token}`
            }
          }
        );
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "SMTP settings updated successfully.",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update SMTP settings.",
        });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col">
        <div className="flex flex-col bg-white mt-5  p-5 rounded-lg">
          <div
            className="flex flex-row items-center gap-2 cursor-pointer justify-end"
            onClick={handleSMTPClick}
          >
            <GoGear fontWeight={"600"} fontSize={20} />
            <div className="font-semibold">SMTP Settings</div>
          </div>
          <div className="flex flex-row justify-around p-1">
            <div className="flex flex-col">
              <label>Dosya Yükle</label>
              <input
                type="file"
                onChange={handleFileChange}
                className=" rounded-md  mt-2"
              />
              <textarea rows={4} cols={40} className="border-2 mt-2 rounded-md p-2"/>
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
                title="Birim Ekleme"
                type="text"
                placeholder="Birim Ekle"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <div className="mt-2">
                <Button text={"Birim Ekle"} onClick={handleAddCategory} />
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
                title="Birim Seçimi"
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
        </div>
      </div>
      <div className="bg-white rounded-lg p-5 mt-5">
        <EmailsTable />
      </div>
    </div>
  );
}

export default Home;
