import React, { useState,useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import BulkMailLogo from "../assets/bulkMailLogo.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import { EmailContext } from "../Context/EmailContext";
import { useAuth } from "../Context/AuthContext";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setEmails } = useContext(EmailContext);
  const { setToken } = useAuth();

  const handleLoginClick = async () => {
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setEmails([]);

      Swal.fire({
        title: "Login Successful!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/home");
      });
    } catch (error) {
      setError(error.response.data.error);
      Swal.fire({
        title: "Login Failed",
        text: error.response.data.error,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <div className="flex flex-col gap-5 items-center justify-center mt-5 p-5">
      <div>
        <img src={BulkMailLogo} width={250} height={250} />
      </div>
      <div className="flex flex-col gap-5 p-8 ">
        <Input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button text={"Login"} onClick={handleLoginClick} />
        <NavLink to="/register">
          <Button text={"Register"} />
        </NavLink>
      </div>
    </div>
  );
}
export default Login;
