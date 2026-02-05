/**
 * Get the current environment from the API base URL
 */
export const getCurrentEnvironment = (): {
  name: 'development' | 'staging' | 'production';
  apiUrl: string;
  color: string;
} => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  if (apiUrl.includes('localhost')) {
    return { name: 'development', apiUrl, color: 'bg-blue-100 text-blue-800' };
  }
  if (apiUrl.includes('development-')) {
    return { name: 'staging', apiUrl, color: 'bg-yellow-100 text-yellow-800' };
  }
  if (apiUrl.includes('stagging-1-')) {
    return { name: 'production', apiUrl, color: 'bg-red-100 text-red-800' };
  }

  return { name: 'development', apiUrl, color: 'bg-gray-100 text-gray-800' };
};
