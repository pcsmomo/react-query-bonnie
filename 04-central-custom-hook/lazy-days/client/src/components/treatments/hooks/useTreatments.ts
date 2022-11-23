import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  const { data = fallback } = useQuery([queryKeys.treatments], getTreatments, {
    // onError: (error) => {
    //   const title =
    //     error instanceof Error
    //       ? error.message
    //       : 'error connecting to the server';
    //   toast({ title, status: 'error' });
    // },
    staleTime: 600000, // 10 minutes
    cacheTime: 900000, // 15 minutes (doesn't make sense for staleTime to exceed cacheTime)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return data;
}

export function usePrefetchTreatment(): void {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery([queryKeys.treatments], getTreatments, {
    staleTime: 600000, // 10 minutes
    cacheTime: 900000, // 15 minutes (doesn't make sense for staleTime to exceed cacheTime)
  });
}
