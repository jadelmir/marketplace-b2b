import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  supplierId: string | null; // Only allow single supplier
  totalPrice: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string } // productId
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SUPPLIER'; payload: string };

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  supplierId: null,
  totalPrice: 0,
};

const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price) * item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_SUPPLIER':
      return { ...state, supplierId: action.payload };

    case 'ADD_ITEM': {
      // Check if adding from same supplier
      if (state.supplierId && state.supplierId !== action.payload.supplierId) {
        // Clear cart and add new supplier's item
        const newItems = [action.payload];
        return {
          ...state,
          items: newItems,
          supplierId: action.payload.supplierId,
          totalPrice: calculateTotalPrice(newItems),
        };
      }

      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.product.id
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.product.id === action.payload.product.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: updatedItems,
        supplierId: action.payload.supplierId,
        totalPrice: calculateTotalPrice(updatedItems),
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      return {
        ...state,
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: Math.max(action.payload.quantity, 0) }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{ state, dispatch, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
