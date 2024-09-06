import React from "react";
import { NavLink,useNavigate } from "react-router-dom";
import BulkMailLogo from '../assets/bulkMailLogo.jpg';
function Header() {
  const navigate = useNavigate();
  const handleLogout = ()=>{
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="flex flex-row items-center bg-white rounded-lg p-10 justify-between">
      <div className="flex flex-row items-center gap-5">
        <img src={BulkMailLogo} width={150} height={150}/>
        <div className="text-xl lg:text-3xl font-semibold">BulkMail App</div>
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
          className="rounded-lg  transition-colors hover:bg-[#FF6F61] cursor-pointer">
          <div className="whitespace-nowrap text-sm font-semibold text-[#484b52] transition-colors sm:text-base p-2 flex items-center">
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
