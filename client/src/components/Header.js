import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BulkMailLogo from "../assets/bulkMailLogo.jpg";
import { RxHamburgerMenu } from "react-icons/rx";

function Header() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const closeMenu = () => {
    setMenuIsOpen(false);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-row items-center bg-white rounded-lg p-10 justify-between">
      <div className="flex flex-row items-center gap-5">
        <img src={BulkMailLogo} width={150} height={150} />
        <div className="hidden sm:text-xl lg:text-3xl font-semibold">
          BulkMail App
        </div>
        <RxHamburgerMenu
          className="text-4xl ml-20 sm:hidden"
          onClick={toggleMenu}
        />
      </div>
      <div
        className={`fixed w-[60%] h-full top-0 right-0 bg-white transform ${
          menuIsOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
      >
        <button
          className="absolute top-5 right-5 text-2xl"
          onClick={toggleMenu}
        >
          ×
        </button>
        <div className="flex flex-col items-start justify-start p-5">
          <NavLink to="/home" className="text-lg p-2 my-2" onClick={closeMenu}>
            Ana Sayfa
          </NavLink>
          <NavLink
            to="/emails"
            className="text-lg p-2 my-2"
            onClick={closeMenu}
          >
            Mailler
          </NavLink>
          <NavLink
            to="/categories"
            className="text-lg p-2 my-2"
            onClick={closeMenu}
          >
            Birimler
          </NavLink>
          <button
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            className="text-lg p-2 my-2 bg-red-500 text-white rounded-md"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="hidden sm:flex flex-row gap-3">
        <div className="rounded-lg bg-[#fdee98]  transition-colors hover:bg-[#bacea9] cursor-pointer">
          <NavLink
            to="/home"
            className={
              "whitespace-nowrap text-sm font-semibold text-[#484b52]  transition-colors sm:text-base p-2 flex items-center"
            }
          >
            Ana Sayfa
          </NavLink>
        </div>
        <div className="rounded-lg bg-[#fdee98]  transition-colors hover:bg-[#bacea9] cursor-pointer">
          <NavLink
            to="/emails"
            className={
              "whitespace-nowrap text-sm font-semibold text-[#484b52] transition-colors sm:text-base p-2 flex items-center"
            }
          >
            Mailler
          </NavLink>
        </div>
        <div className="rounded-lg bg-[#fdee98]  transition-colors hover:bg-[#bacea9] cursor-pointer">
          <NavLink
            to="/categories"
            className={
              "whitespace-nowrap text-sm font-semibold text-[#484b52] transition-colors sm:text-base p-2 flex items-center"
            }
          >
            Birimler
          </NavLink>
        </div>
        <div
          onClick={handleLogout}
          className="rounded-lg  transition-colors hover:bg-[#FF6F61] cursor-pointer"
        >
          <div className="whitespace-nowrap text-sm font-semibold text-[#484b52] transition-colors sm:text-base p-2 flex items-center">
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
