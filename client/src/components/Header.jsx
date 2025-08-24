import React from "react";

const Header = ({ title, subtitle, onToggleSidebar }) => {
  return (
    <header className="sticky top-0 bg-white shadow-sm h-16 border-b z-40">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
            className="md:hidden flex flex-col justify-between w-6 h-5 focus:outline-none"
          >
            <span className="block w-full h-0.5 bg-gray-800"></span>
            <span className="block w-full h-0.5 bg-gray-800"></span>
            <span className="block w-full h-0.5 bg-gray-800"></span>
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>

        {/* Right side (optional actions) */}
        <div />
      </div>
    </header>
  );
};

export default Header;
