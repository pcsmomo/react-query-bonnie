import { act, renderHook } from '@testing-library/react-hooks';

import { createQueryClientWrapper } from '../../../test-utils';
import { useAppointments } from '../hooks/useAppointments';

test('filter appointments by availability', async () => {
  const { result, waitFor } = renderHook(useAppointments, {
    wrapper: createQueryClientWrapper(),
  });

  // to get your bearings
  console.log(result);
  console.log(result.current);

  // wait for the appointments to populate
  await waitFor(() => Object.keys(result.current.appointments).length > 0);

  const filteredAppointsLength = Object.keys(result.current.appointments)
    .length;

  // set to show all appointments
  act(() => result.current.setShowAll(true));

  // await for the appointments to show more than when filtered
  await waitFor(
    () =>
      Object.keys(result.current.appointments).length > filteredAppointsLength,
  );
});
