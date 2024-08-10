import React from "react";
import { NavLink } from "react-router-dom";
function Header() {
  return (
    <div className="flex flex-row items-center bg-white rounded-lg p-10 justify-between">
      <div className="text-3xl font-semibold">BulkMail App</div>
      <div className="flex flex-row gap-3">
      <div className="rounded-lg bg-[#fdee98]  transition-colors hover:bg-[#bacea9] cursor-pointer">
          <NavLink
            to="/"
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
      </div>
    </div>
  );
}

export default Header;
