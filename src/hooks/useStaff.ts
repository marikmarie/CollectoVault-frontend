// frontend/src/hooks/useStaff.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffAPI } from '../api/staff';

export function useManualTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => StaffAPI.manualTransaction(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff', 'transactions'] });
      qc.invalidateQueries({ queryKey: ['customer', 'me'] });
    },
  });
}
export function useUploadReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, customerId }: { file: File; customerId: number }) => StaffAPI.uploadReceipt(file, customerId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff', 'transactions'] }),
  });
}
export function useTransactions(filters?: any) {
  return useQuery({
    queryKey: ['staff', 'transactions', filters || 'all'],
    queryFn: () => StaffAPI.listTransactions(filters || {}),
    staleTime: 60_000,
  });
}

export function useConfirmTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload?: any }) => StaffAPI.confirmTransaction(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff', 'transactions'] });
      qc.invalidateQueries({ queryKey: ['customer', 'me'] });
    },
  });
}
export function useReport(period: 'daily' | 'weekly', dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['staff', 'report', period, dateFrom, dateTo],
    queryFn: () => StaffAPI.getReport(period, dateFrom, dateTo),
  });
}
