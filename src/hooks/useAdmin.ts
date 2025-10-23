import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminAPI } from '../api/admin';

// ✅ Rewards Hook
export function useAdminRewards() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['admin', 'rewards'],
    queryFn: AdminAPI.listRewards,
  });

  const create = useMutation({
    mutationFn: AdminAPI.createReward,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'rewards'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, p }: any) => AdminAPI.updateReward(id, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'rewards'] }),
  });

  const remove = useMutation({
    mutationFn: AdminAPI.deleteReward,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'rewards'] }),
  });

  return { list, create, update, remove };
}


export function useAdminTiers() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['admin', 'tiers'],
    queryFn: AdminAPI.listTiers,
  });

  const create = useMutation({
    mutationFn: AdminAPI.createTier,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'tiers'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, p }: any) => AdminAPI.updateTier(id, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'tiers'] }),
  });

  const remove = useMutation({
    mutationFn: AdminAPI.deleteTier,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'tiers'] }),
  });

  return { list, create, update, remove };
}


export function useAdminPointRules() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['admin', 'pointRules'],
    queryFn: AdminAPI.listPointRules,
  });

  const create = useMutation({
    mutationFn: AdminAPI.createPointRule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'pointRules'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, p }: any) => AdminAPI.updatePointRule(id, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'pointRules'] }),
  });

  const remove = useMutation({
    mutationFn: AdminAPI.deletePointRule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'pointRules'] }),
  });

  return { list, create, update, remove };
}

// ✅ Reports Hook
export function useAdminReports(dateFrom?: string, dateTo?: string) {
  const summary = useQuery({
    queryKey: ['admin', 'reports', 'summary', dateFrom, dateTo],
    queryFn: () => AdminAPI.summaryReport(dateFrom, dateTo),
  });

  const topCustomers = useQuery({
    queryKey: ['admin', 'reports', 'top-customers', dateFrom, dateTo],
    queryFn: () => AdminAPI.topCustomers(10, dateFrom, dateTo),
  });

  return { summary, topCustomers };
}
