import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import BulkMailLogo from "../assets/bulkMailLogo.jpg";
import axios from 'axios'
import Swal from 'sweetalert2';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const handleRegisterClick = async () => {
        setError(null);
        setSuccess(null);
    
        try {
            console.log(email);
            console.log(password);
            console.log(confirmPassword);
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
            email,
            password,
            confirmPassword,
          });

         
          Swal.fire({
            title: 'Registration Successful!',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/'); 
          });

          setSuccess(response.data.message);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } catch (error) {
          setError(error.response.data.error);
          Swal.fire({
            title: 'Registration Failed',
            text: error.response.data.error,
            icon: 'error',
            confirmButtonText: 'OK'
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
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <Button text={"Register"} onClick={handleRegisterClick} />
        <NavLink to="/">
          <Button text={"Login"} />
        </NavLink>
      </div>
    </div>
  );
}
export default Register;
