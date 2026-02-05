import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SupplierUser } from '../../types';
import { useGetCategories } from '../../hooks/useCategories';
import { useCreateProduct } from '../../hooks/useMutations';
import { SupplierSidebar, SupplierHeader } from '../../components/supplier';

interface FormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: string;
  unit: string;
  moq: string;
  stock: string;
  sku: string;
}

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategories();
  const [supplier, setSupplier] = useState<SupplierUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    unit: 'kg',
    moq: '',
    stock: '',
    sku: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

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
      companyName: state.user.name,
      email: state.user.email,
    };
    setSupplier(supplierData);
  }, [state.user, isInitializing, navigate]);

  // Get subcategories for selected category
  const selectedCategory = categories.find(
    (c) => c.id === formData.category
  );
  const subcategories = selectedCategory?.subcategories || [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = 'Price must be greater than 0';
    if (!formData.unit) newErrors.unit = 'Unit type is required';
    if (!formData.moq || parseFloat(formData.moq) < 0) newErrors.moq = 'MOQ must be >= 0';
    if (!formData.stock || parseFloat(formData.stock) < 0)
      newErrors.stock = 'Stock must be >= 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create product payload matching API expectations
    const productPayload = {
      name: formData.name,
      description: formData.description,
      category_id: formData.category,
      subcategory_id: formData.subcategory,
      price: parseFloat(formData.price),
      stock: parseFloat(formData.stock),
      sku: formData.sku || undefined,
      image_url: undefined,
    };

    createProduct(productPayload, {
      onSuccess: () => {
        setSuccessMessage('Product added successfully!');
        setTimeout(() => {
          navigate('/supplier/products');
        }, 1500);
      },
      onError: (error) => {
        setErrors((prev) => ({
          ...prev,
          submit: error instanceof Error ? error.message : 'Failed to create product',
        }));
      },
    });
  };
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
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600 mt-2">
                Fill in the details below to add a new product to your inventory
              </p>
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

            {/* Form */}
            <div className="bg-white rounded-lg shadow">
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Basic Info Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Basic Information
                  </h2>
                  <div className="space-y-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Organic Tomatoes"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your product, quality, origin, etc."
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                      />
                      {errors.description && (
                        <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                      )}
                    </div>

                    {/* SKU */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product SKU / Code (Optional)
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="e.g., ORG-TOM-001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Subcategory Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Category & Subcategory
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        disabled={categoriesLoading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
                      >
                        <option value="">{categoriesLoading ? 'Loading categories...' : 'Select a category...'}</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                      )}
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory *
                      </label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        disabled={!formData.category}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
                      >
                        <option value="">
                          {formData.category ? 'Select a subcategory...' : 'Select category first'}
                        </option>
                        {subcategories.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                      {errors.subcategory && (
                        <p className="text-red-600 text-sm mt-1">{errors.subcategory}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Pricing & Inventory
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price per Unit ($) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                      {errors.price && (
                        <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                      )}
                    </div>

                    {/* Unit Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Type *
                      </label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="pieces">Pieces</option>
                        <option value="liters">Liters (L)</option>
                        <option value="ml">Milliliters (ml)</option>
                        <option value="boxes">Boxes</option>
                        <option value="bags">Bags</option>
                        <option value="cartons">Cartons</option>
                      </select>
                      {errors.unit && (
                        <p className="text-red-600 text-sm mt-1">{errors.unit}</p>
                      )}
                    </div>

                    {/* MOQ */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Order Quantity (MOQ) *
                      </label>
                      <input
                        type="number"
                        name="moq"
                        value={formData.moq}
                        onChange={handleInputChange}
                        placeholder="0"
                        step="1"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                      {errors.moq && (
                        <p className="text-red-600 text-sm mt-1">{errors.moq}</p>
                      )}
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Stock Quantity *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        step="1"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                      {errors.stock && (
                        <p className="text-red-600 text-sm mt-1">{errors.stock}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/supplier/products')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                    disabled={isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition flex items-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
