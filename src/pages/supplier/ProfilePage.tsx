import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupplierHeader, SupplierSidebar } from '../../components/supplier';
import { useAuth } from '../../context/AuthContext';
import { SupplierUser } from '../../types';

interface FormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  businessAddress: string;
  businessLicense: string;
  description: string;
  specialties: string[];
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [supplier, setSupplier] = useState<SupplierUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    businessAddress: '',
    businessLicense: '',
    description: '',
    specialties: [],
  });

  const categories = ['Vegetables', 'Fruits', 'Bakery', 'Grains', 'Cereals', 'Dairy', 'Meat'];

  // Wait for auth restoration on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Check authentication and load supplier data once initialized
  useEffect(() => {
    if (isInitializing) return;

    // Check if user is authenticated as supplier
    if (!state.user || state.user.role !== 'SUPPLIER') {
      navigate('/login');
      return;
    }

    // Set supplier data from auth context
    const supplierData: SupplierUser = {
      id: state.user.id,
      companyName: state.user.name || '',
      email: state.user.email,
    };
    setSupplier(supplierData);
    setFormData({
      companyName: supplierData.companyName || '',
      contactName: '',
      email: supplierData.email || '',
      phone: '',
      businessAddress: '',
      businessLicense: '',
      description: '',
      specialties: [],
    });
  }, [state.user, isInitializing, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      // Update localStorage with new data
      const updatedSupplier: SupplierUser = {
        ...supplier!,
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('supplierAuth', JSON.stringify(updatedSupplier));
      setSupplier(updatedSupplier);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setIsSaving(false);

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 800);
  };

  const handleCancel = () => {
    if (supplier) {
      setFormData({
        companyName: supplier.companyName || '',
        contactName: supplier.contactName || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        businessAddress: supplier.businessAddress || '',
        businessLicense: supplier.businessLicense || '',
        description: supplier.description || '',
        specialties: supplier.specialties || [],
      });
    }
    setIsEditing(false);
  };

  if (!supplier) {
    return null;
  }

  if (isInitializing || !supplier) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SupplierSidebar open={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <SupplierHeader
          supplier={supplier}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-2">Manage your company information and preferences</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {successMessage}
              </div>
            )}

            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow">
              {/* Header with Edit Button */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{supplier.companyName || supplier.name}</h2>
                  <p className="text-gray-600 mt-1">Member since {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    isEditing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-8">
                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Company Information
                  </h3>
                  <div className="space-y-6">
                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Contact Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Business License */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business License Number
                      </label>
                      <input
                        type="text"
                        name="businessLicense"
                        value={formData.businessLicense}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Business Address
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    About Your Business
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description / Bio
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell buyers about your business..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Specialties / Categories
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg transition cursor-pointer ${
                          formData.specialties.includes(category)
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(category)}
                          onChange={() => handleSpecialtyToggle(category)}
                          disabled={!isEditing}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                        <span className="font-medium text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                {isEditing && (
                  <div className="flex gap-4 justify-end border-t border-gray-200 pt-6">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="animate-spin w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Actions */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium">
                  Change Password
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('supplierAuth');
                    localStorage.removeItem('supplierId');
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 transition text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
