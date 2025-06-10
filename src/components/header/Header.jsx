import React, { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/service", label: "Services" }, // Sửa từ /services thành /service
  { path: "/guide", label: "Guide" },
  { path: "/pricing", label: "Pricing" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" }
];

const HomeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const isActivePath = useCallback((path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  }, [location]);

  const NavLink = ({ to, children, className = "" }) => (
    <Link
      to={to}
      className={`${className} text-white transition-colors font-semibold text-lg
        ${isActivePath(to) ? 'text-blue-200' : 'hover:text-blue-200'}`}
    >
      {children}
    </Link>
  );

  return (
    <header className="fixed top-0 z-50 w-full h-[80px] flex items-center bg-[#1E4679] px-4 md:px-12">
      <div className="flex items-center justify-between w-full h-full">
        {/* Logo Section */}
        <div className="flex items-center flex-shrink-0 h-full">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity h-full py-2">
            <img 
              src="/images/logo.png" 
              alt="DNA Testing Services" 
              className="h-full w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/fallback-logo.png';
              }}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-x-10 flex-grow justify-center h-full">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.path} to={item.path}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Sign In/Sign Up Box */}
        <div 
          className="hidden md:flex border-2 border-white rounded-lg px-6 py-2 flex-shrink-0 bg-[#1D3876] items-center ml-4"
          style={{ height: '45px', minWidth: '180px' }}
        >
          <div className="flex items-center space-x-4">
            <NavLink 
              to="/login"
              className="text-base"
            >
              Sign In
            </NavLink>
            <span className="text-white text-base font-bold">|</span>
            <NavLink 
              to="/register"
              className="text-base"
            >
              Sign Up
            </NavLink>
          </div>
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 ml-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-white my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-[80px] left-0 w-full transition-all duration-300 
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{backgroundColor: '#1E4679'}}
      >
        <nav className="flex flex-col py-4">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className="py-3 px-8 border-b border-blue-600 text-base"
            >
              {item.label}
            </NavLink>
          ))}
          {/* Mobile Sign In/Up */}
          <div className="flex items-center justify-center space-x-4 py-4 px-8">
            <NavLink 
              to="/login"
              className="text-base"
            >
              Sign In
            </NavLink>
            <span className="text-white text-base font-bold">|</span>
            <NavLink 
              to="/register"
              className="text-base"
            >
              Sign Up
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default React.memo(HomeHeader);