import { useMutation } from '@tanstack/react-query';
import { buyerLogin, buyerRegister, supplierLogin, supplierRegister, logout, BuyerLoginPayload, BuyerRegisterPayload, SupplierLoginPayload, SupplierRegisterPayload, AuthResponse } from '../api/auth';

export const useBuyerLogin = () => {
  return useMutation({
    mutationFn: (payload: BuyerLoginPayload) => buyerLogin(payload),
  });
};

export const useBuyerRegister = () => {
  return useMutation({
    mutationFn: (payload: BuyerRegisterPayload) => buyerRegister(payload),
  });
};

export const useSupplierLogin = () => {
  return useMutation({
    mutationFn: (payload: SupplierLoginPayload) => supplierLogin(payload),
  });
};

export const useSupplierRegister = () => {
  return useMutation({
    mutationFn: (payload: SupplierRegisterPayload) => supplierRegister(payload),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

// Re-export types
export type { AuthResponse, BuyerLoginPayload, BuyerRegisterPayload, SupplierLoginPayload, SupplierRegisterPayload };
