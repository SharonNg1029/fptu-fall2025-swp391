import {
  FacebookFilled,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

// Đổi tên component footer của bạn thành HomeFooter cho khớp với file index.jsx
const HomeFooter = () => {
  return (
    // Container này giờ sẽ được thẻ cha (.home-footer) tự động căn giữa
    // Nó chỉ cần quy định chiều rộng tối đa và padding bên trong
    <div className="w-full max-w-[1600px]">

      {/* Grid chứa các cột nội dung */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 text-left">
        
        {/* Cột 1: Logo + Mô tả */}
        <div>
          <Link to="/">
            <img src="/images/logo.png" alt="Logo" className="h-[50px] mb-5" />
          </Link>
          <p className="mt-[20px] mb-3 leading-[1.6] text-[16px]">
            Genetix - Vietnam’s Leading Trusted DNA Testing Center
          </p>
          <div className="flex gap-3 text-[24px] mt-[15px]">
            <FacebookFilled className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
            <TwitterOutlined className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
            <InstagramOutlined className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
            <YoutubeFilled className="cursor-pointer hover:text-[#3fa9f5] transition-colors" />
          </div>
        </div>

        {/* Cột 2, 3, 4 ... (giữ nguyên code các cột của bạn) */}
        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h4 className="font-bold text-lg mb-4 border-b-2 border-[#3fa9f5] inline-block pb-1">
            Quick Links
          </h4>
          <ul className="list-none p-0 space-y-2">
            <li className="hover:text-[#3fa9f5] transition-colors cursor-pointer">Home</li>
            <li className="hover:text-[#3fa9f5] transition-colors cursor-pointer">DNA Testing Services</li>
            <li className="hover:text-[#3fa9f5] transition-colors cursor-pointer">Instructions</li>
            <li className="hover:text-[#3fa9f5] transition-colors cursor-pointer">Pricing</li>
            <li className="hover:text-[#3fa9f5] transition-colors cursor-pointer">Knowledge Blog</li>
            <li className="hover:text-[#3fa9f5] transition-colors cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Cột 3: Dịch vụ */}
        <div>
          <h4 className="font-bold text-lg mb-4 border-b-2 border-[#3fa9f5] inline-block pb-1">
            Our Services
          </h4>
          <ul className="list-none p-0 space-y-2">
            <li className="hover:text-[#3fa9f5] transition-colors cursor-pointer">Civil DNA Testing</li>
            <li className="hover:text-[#3fa9f5] transition-colors cursor-pointer">Legal DNA Testing</li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h4 className="font-bold text-lg mb-4 border-b-2 border-[#3fa9f5] inline-block pb-1">
            Contact Us
          </h4>
          <ul className="list-none p-0 space-y-3">
            <li className="flex items-start gap-3">
              <EnvironmentOutlined className="mt-1" />
              <span>7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City, 700000</span>
            </li>
            <li className="flex items-center gap-3 hover:text-[#3fa9f5] transition-colors cursor-pointer">
              <PhoneOutlined />
              <span>Hotline: +84 901 452 366</span>
            </li>
            <li className="flex items-center gap-3 hover:text-[#3fa9f5] transition-colors cursor-pointer">
              <MailOutlined />
              <span>genetix.noreply@gmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <ClockCircleOutlined className="mt-1" />
              <span>Business Hours: 8:00 AM – 5:30 PM (Mon–Sat)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Dòng Copyright */}
      <div className="text-center mt-12 pt-8 border-t border-gray-700 text-[#ccc] text-[15px]">
        © 2025 Genetix DNA Testing Center. All rights reserved.
      </div>
      
    </div>
  );
};

export default HomeFooter;