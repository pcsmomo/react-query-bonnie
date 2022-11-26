import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

async function getUser(
  user: User | null,
  signal: AbortSignal,
): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
      signal,
    },
  );
  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();
  const { data: user } = useQuery(
    [queryKeys.user],
    ({ signal }) => getUser(user, signal),
    {
      initialData: getStoredUser,
      onSuccess: (received: User | null) => {
        if (!received) {
          clearStoredUser();
        } else {
          setStoredUser(received);
        }
      },
    },
  );

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    queryClient.setQueryData([queryKeys.user], newUser);

    // With React Query v4, onSuccess is called only for a successful query function,
    //     not for queryClient.setQueryData. Reference:
    //     https://tanstack.com/query/v4/docs/guides/migrating-to-react-query-4#onsuccess-is-no-longer-called-from-setquerydata
    setStoredUser(newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    queryClient.setQueryData([queryKeys.user], null);

    // With React Query v4, onSuccess is called only for a successful query function,
    //     not for queryClient.setQueryData. Reference:
    //     https://tanstack.com/query/v4/docs/guides/migrating-to-react-query-4#onsuccess-is-no-longer-called-from-setquerydata
    clearStoredUser();

    // remove user appointments query
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]);
  }

  return { user, updateUser, clearUser };
}
