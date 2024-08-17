import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import BulkMailLogo from "../assets/bulkMailLogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        <Button text={"Login"} />
        <NavLink to="/register">
          <Button text={"Register"} />
        </NavLink>
      </div>
    </div>
  );
}
export default Login;