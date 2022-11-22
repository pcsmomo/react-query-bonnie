import { useQuery } from '@tanstack/react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
// import { useCustomToast } from '../../app/hooks/useCustomToast';

async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  // the error handling is centralized in `queryClient.ts`
  // const toast = useCustomToast();

  const fallback = [];
  const { data = fallback } = useQuery(
    [queryKeys.treatments],
    getTreatments,
    //   {
    //   onError: (error) => {
    //     const title =
    //       error instanceof Error
    //         ? error.message
    //         : 'error connecting to the server';
    //     toast({ title, status: 'error' });
    //   },
    // }
  );
  return data;
}
