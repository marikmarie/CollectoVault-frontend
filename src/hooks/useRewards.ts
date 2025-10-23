// frontend/src/hooks/useRewards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomerAPI } from '../api/customer';

type RedeemPayload = {
  customerId: number;
  rewardId: number;
};

export function useRewards() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['rewards'],
    queryFn: () => CustomerAPI.listRewards(),
  });

  const redeem = useMutation({
    mutationFn: ({ customerId, rewardId }: RedeemPayload) =>
      CustomerAPI.redeemReward(customerId, rewardId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer', 'me'] });
      qc.invalidateQueries({ queryKey: ['rewards'] });
      qc.invalidateQueries({ queryKey: ['customer', 'transactions'] });
    },
  });

  return { list, redeem };
}
