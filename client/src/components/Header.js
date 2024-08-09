import React from "react";

function Header() {
  return (
    <div className="flex flex-row items-center bg-white rounded-lg p-10 justify-between">
      <div className="text-3xl font-semibold">BulkMail App</div>
      <div className="flex flex-row gap-3">
        <div className="rounded-lg bg-[#4079ED] text-white transition-colors hover:bg-[#6993FF] cursor-pointer">
          <div className="whitespace-nowrap text-sm font-semibold text-white transition-colors sm:text-base p-2">
            Ana Sayfa
          </div>
        </div>
        <div className="rounded-lg bg-[#4079ED] text-white transition-colors hover:bg-[#6993FF] cursor-pointer">
          <div className="whitespace-nowrap text-sm font-semibold text-white transition-colors sm:text-base p-2">
            Mailler
          </div>
        </div>
        <div className="rounded-lg bg-[#4079ED] text-white transition-colors hover:bg-[#6993FF] cursor-pointer">
          <div className="whitespace-nowrap text-sm font-semibold text-white transition-colors sm:text-base p-2">
            Kategoriler
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
