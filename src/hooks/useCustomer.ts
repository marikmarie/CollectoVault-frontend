// frontend/src/hooks/useCustomer.ts
import { useQuery } from '@tanstack/react-query';
import { CustomerAPI } from '../api/customer';


export function useCustomer() {
  return useQuery({
    queryKey: ['customer', 'me'],
    queryFn: () => CustomerAPI.getMe(),
  });
}

// export function useCustomer() {
//   return useQuery({
//     queryKey: ['customer', 'me'],
//     queryFn: () => CustomerAPI.getMe(),
//     staleTime: 1000 * 60 * 1, // 1 minute
//   });
// }
