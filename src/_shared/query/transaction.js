import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../apis/transaction';
import { queryKeys } from './keys';

export const useGetTransactions = (
  {
    category_id = '',
    transaction_type = 0,
    transaction_time: { gte = 0, lte = 0 } = {},
    paging: { limit = 500, page = 1 } = {},
  } = {},
  opts = {},
) => {
  return useQuery({
    queryFn: () =>
      getTransactions({
        category_id: category_id,
        transaction_type: transaction_type,
        transaction_time: {
          gte: gte,
          lte: lte,
        },
        paging: {
          limit: limit,
          page: page,
        },
      }),
    queryKey: [queryKeys.getTransactions, ...(opts.queryOnChange || [])],
    onSuccess: opts.onSuccess || function () {},
  });
};
