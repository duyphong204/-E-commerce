import React from "react";
import zaloIcon from "../../../assets/zaloicon.webp";

const ZaloChatIcon: React.FC = () => {
  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-50 group">
      <a
        href="https://zalo.me/0935452263"
        target="_blank"
        rel="noopener noreferrer"
        className="relative block"
      >
        <span
          className="absolute right-full mr-3 translate-y-1/2 bottom-1/2
                        invisible opacity-0 group-hover:visible group-hover:opacity-100
                        bg-gray-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl 
                        shadow-lg transition-all duration-300 whitespace-nowrap border border-gray-800"
        >
          Chat qua Zalo
        </span>

        <img
          src={zaloIcon}
          alt="Chat qua Zalo"
          className="rounded-full w-12 h-12 sm:w-14 sm:h-14 hover:shadow-xl cursor-pointer 
                     hover:scale-105 transition-all duration-300 ease-in-out"
        />
      </a>
    </div>
  );
};

export default ZaloChatIcon;
