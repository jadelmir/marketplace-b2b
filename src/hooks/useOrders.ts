import { useQuery, useMutation } from '@tanstack/react-query';
import { placeOrder, getBuyerOrders, getOrderById } from '../api/orders';
import { Order } from '../types';

interface PlaceOrderPayload {
  supplierId: string;
  items: Array<{ productId: string; quantity: number }>;
}

export const useGetBuyerOrders = () => {
  return useQuery({
    queryKey: ['orders', 'buyer'],
    queryFn: getBuyerOrders,
  });
};

export const useGetOrderById = (orderId: string | undefined) => {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
  });
};

export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: async (payload: PlaceOrderPayload): Promise<Order> => {
      return placeOrder(payload.supplierId, payload.items);
    },
  });
};
