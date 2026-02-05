import React from 'react';
import { SupplierUser } from '../../types';

interface SupplierHeaderProps {
  supplier: SupplierUser;
  onMenuClick: () => void;
}

const SupplierHeader: React.FC<SupplierHeaderProps> = ({ supplier, onMenuClick }) => {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Company Name */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Supplier Portal</h2>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-lg relative">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {(supplier?.companyName || supplier?.name || '?').charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{supplier.contactName}</p>
              <p className="text-xs text-gray-600">{supplier.email}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <a
                href="/supplier/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile Settings
              </a>
              <a
                href="/supplier/login"
                onClick={() => {
                  localStorage.removeItem('supplierAuth');
                  localStorage.removeItem('supplierId');
                }}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-t border-gray-200"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierHeader;
