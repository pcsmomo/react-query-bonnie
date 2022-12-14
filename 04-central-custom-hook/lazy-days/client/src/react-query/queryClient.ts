import { createStandaloneToast } from '@chakra-ui/react';
import { QueryCache, QueryClient } from '@tanstack/react-query';

import { theme } from '../theme';

const toast = createStandaloneToast({ theme });

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  /// ////////////////////////////
  // NOTE: no toast.closeAll() //
  /// ////////////////////////////

  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

export function generateQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: queryErrorHandler,
    }),
    defaultOptions: {
      queries: {
        // onError: queryErrorHandler
        staleTime: 600000, // 10 minutes
        cacheTime: 900000, // 15 minutes
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      mutations: {
        // onError: queryErrorHandler
      },
    },
  });
}

export const queryClient = generateQueryClient();

// Global error handling with defaultOptions
// import { createStandaloneToast } from '@chakra-ui/react';
// import { QueryClient } from '@tanstack/react-query';

// import { theme } from '../theme';

// const toast = createStandaloneToast({ theme });

// function queryErrorHandler(error: unknown): void {
//   // error is type unknown because in js, anything can be an error (e.g. throw(5))
//   const id = 'react-query-error';
//   const title =
//     error instanceof Error ? error.message : 'error connecting to server';

//   // prevent duplicate toasts
//   toast.closeAll();
//   toast({ id, title, status: 'error', variant: 'subtle', isClosable: true });
// }

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       onError: queryErrorHandler,
//     },
//   },
// });
