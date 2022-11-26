import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { rest } from 'msw';

// import { defaultQueryClientOptions } from '../../../react-query/queryClient';
import { server } from '../../../mocks/server';
import { generateQueryClient } from '../../../react-query/queryClient';
import { renderWithClient } from '../../../test-utils';
import { AllStaff } from '../AllStaff';

test('renders response from query', async () => {
  renderWithClient(<AllStaff />);

  const staffNames = await screen.findAllByRole('heading', {
    name: /divya|sandra|michael|mateo/i,
  });

  expect(staffNames).toHaveLength(4);
});

test('handles query error', async () => {
  // (re)set handler to return a 500 error for staff
  server.use(
    rest.get('http://localhost:3030/staff', (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );

  // set up query client with retries set to false
  const productionClient = generateQueryClient();
  const cache = productionClient.getQueryCache();
  const options = productionClient.getDefaultOptions();
  // in this react-query v4, the test just passes without retry option
  options.queries = { ...options.queries, retry: false };

  const client = new QueryClient({
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

  // render wrapped with provider
  render(
    <QueryClientProvider client={client}>
      <AllStaff />
    </QueryClientProvider>,
  );

  // check for toast alert
  const alertToast = await screen.findByRole('alert');
  expect(alertToast).toHaveTextContent('Request failed with status code 500');
});
