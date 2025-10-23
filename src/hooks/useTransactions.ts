
// frontend/src/hooks/useTransactions.ts
import { useQuery } from '@tanstack/react-query';
import { CustomerAPI } from '../api/customer';

export function useTransactions(customerId?: number) {
  return useQuery({
    queryKey: ['customer', customerId, 'transactions'],
    queryFn: async () => {
      if (!customerId) return []; // ✅ prevents crashing
      return CustomerAPI.getTransactions(customerId, 0, 100);
    },
  });
}



// // frontend/src/hooks/useTransactions.ts
// import { useQuery } from '@tanstack/react-query';
// import { CustomerAPI } from '../api/customer';

// export function useTransactions(customerId?: number) {
//   return useQuery(
//     ['customer', customerId, 'transactions'],
//     () => {
//       if (!customerId) return []; // ✅ Prevents fetching with undefined
//       return CustomerAPI.getTransactions(customerId, 0, 100);
//     }
//   );
// }
