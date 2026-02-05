import { useMutation } from '@tanstack/react-query';
import { useAuth, UserRole } from '../context/AuthContext';
import { buyerLogin, supplierLogin, AuthResponse } from '../api/auth';

interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export const useLogin = () => {
  const { dispatch } = useAuth();

  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<AuthResponse> => {
      dispatch({ type: 'LOGIN_START' });
      
      if (payload.role === 'BUYER') {
        return await buyerLogin({
          email: payload.email,
          password: payload.password,
        });
      } else {
        return await supplierLogin({
          email: payload.email,
          password: payload.password,
        });
      }
    },
    onSuccess: (data) => {
      console.log('Login successful:', data);
      // Store token in localStorage
      localStorage.setItem('authToken', data.access_token);
      let role = data.user.role.toUpperCase() as UserRole;
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userEmail', data.user.email);
      
      // Determine user name based on role
      const name = data.user.email 

      localStorage.setItem('userName', name);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          id: data.user.id,
          email: data.user.email,
          name: name,
          role: role,
        },
      });
    },
    onError: (error) => {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
    },
  });
};
