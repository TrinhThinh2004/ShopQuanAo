import type { FC } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../../assets/images/logo-header.png";


const HeaderTop: FC = () => (
  <div className="bg-black border-b border-gray-800">
    <div className="max-w-[1170px] mx-auto px-[15px] py-[10px] flex items-center justify-between h-[73.2px]">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 pl-[15px] w-[292.5px] h-[35px]">
        <img src={logo} alt="Logo" className="h-[35px] w-auto object-contain" />
      </div>

      {/* Search */}
      <div className="flex items-center w-[570px] h-[40px] p-[2px] bg-white rounded-md border border-gray-300">
  <input
    type="text"
    placeholder="Bạn đang tìm gì..."
    className="flex-1 h-full px-4 text-sm focus:outline-none  text-black placeholder-gray-400 bg-white rounded-l-full"
  />
  <button className="bg-black text-white w-[80px] h-[36px] rounded-md hover:bg-gray-800 transition flex items-center justify-center">
    <FaSearch size={24} />
  </button>
</div>

      {/* Actions */}
      <ul className="list-inline list-unstyled mb-0 flex items-center gap-10 text-white w-[292.5px] h-[53.2px] pl-[62.25px] pr-[62.25px]">
        <li className="flex items-center gap-2 hover:text-gray-300 transition w-[56px] h-[53.2px]">
          <a href="#" className="flex flex-col items-center gap-2">
            <FaMapMarkerAlt size={18} />
            <span className="hidden md:inline font-medium text-sm whitespace-nowrap">Cửa hàng</span>
          </a>
        </li>
        <li className="flex items-center gap-2 hover:text-gray-300 transition w-[56px] h-[53.2px]">
          <a href="#" className="flex flex-col items-center gap-2">
            <FaUser size={18} />
            <span className="hidden md:inline font-medium text-sm whitespace-nowrap">Đăng nhập</span>
          </a>
        </li>
        <li className="flex items-center gap-2 hover:text-gray-300 transition w-[56px] h-[53.2px]">
          <a href="#" className="flex flex-col items-center gap-2">
            <FaShoppingCart size={18} />
            <span className="hidden md:inline font-medium text-sm whitespace-nowrap">Giỏ hàng</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
);

const HeaderBottom: FC = () => (
  <nav className="bg-white text-black">
    <div className="max-w-[1170px] mx-auto px-[15px]">
      <ul className="flex justify-center gap-10 py-3 text-sm font-bold  uppercase tracking-wide">
        {[
          "Hàng mới",
          "Sản phẩm",
          "Áo nam",
          "Quần nam",
          "Phụ kiện",
          "Outlet",
          "Disney",
          "Jeans",
          "Tin thời trang",
        ].map((item) => (
          <li
            key={item}
            className="relative cursor-pointer hover:text-[#F68200] transition group"
          >
            {item}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#F68200] transition-all duration-300 group-hover:w-full"></span>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);


const Header: FC = () => (
  <header className="w-full shadow-md">
    <HeaderTop />
    <HeaderBottom />
  </header>
);

export default Header;