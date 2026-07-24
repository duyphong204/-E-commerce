import React from "react";
import { TbBrandFacebook } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar: React.FC = () => {
  return (
    <div className="bg-rabbit-red text-white">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://www.facebook.com/phong.duy.316058"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
            aria-label="Facebook"
          >
            <TbBrandFacebook className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/dndp_04/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
            aria-label="Instagram"
          >
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300" aria-label="Twitter X">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>
        <div className="text-sm text-center flex-grow">
          <span>Chúng tôi giao hàng trên toàn thế giới - Giao hàng nhanh chóng và đáng tin cậy!</span>
        </div>
        <div className="text-sm hidden md:block">
          <a href="tel:+84935452263" className="hover:text-gray-300">
            +84-0935452263
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
