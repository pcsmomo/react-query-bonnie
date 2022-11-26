import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';

import { generateQueryClient } from '../react-query/queryClient';
// import { defaultQueryClientOptions } from '../react-query/queryClient';

// make a function to generate a unique query client for each test
const generateTestQueryClient = () => {
  const client = generateQueryClient();
  const cache = client.getQueryCache();
  const options = client.getDefaultOptions();
  // in this react-query v4, the test just passes without retry option
  // options.queries = { ...options.queries, retry: false };

  return new QueryClient({
    queryCache: cache,
    defaultOptions: options,
    logger: {
      // eslint-disable-next-line no-console
      log: console.log,
      // eslint-disable-next-line no-console
      warn: console.warn,
      error: () => {
        // swallow errors without printing out
        // just to make the console clear for test
        // as they are intended error messages, there's no need to print them
      },
    },
  });
};

export function renderWithClient(
  ui: ReactElement,
  client?: QueryClient,
): RenderResult {
  const queryClient = client ?? generateTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
// export const createQueryClientWrapper = (): React.FC => {
//   const queryClient = generateQueryClient();
//   return ({ children }) => (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// };
