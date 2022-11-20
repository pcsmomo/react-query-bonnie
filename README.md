# React Query / TanStack Query: React Server State Management

React Query / TanStack Query: React Server State Management by Bonnie Schulkin

## Folder structure

- 1
- 2

## Details

<details open>
  <summary>Click to Contract/Expend</summary>

### 7. Handling Loading and Error States

- `isFetching`
  - the async query function hasn't yet resolved
- `isLoading` (subset of isFetching)
  - no cached data, plus `isFetching`

### 8. React Query Dev Tools

- [Doc: React query - Devtools](https://tanstack.com/query/v4/docs/devtools)
- [Doc: React query v3 - Devtools](https://react-query-v3.tanstack.com/devtools)

### 9. staleTime vs cacheTime

#### staleTime

- Why does it matter if the data is stale?
- Data refetch only triggers for stale data
  - For example, component remount, window refocus
  - _staleTime_ translates to "max age"
  - How to tolerate data potentially being out of date?

#### staleTime vs cacheTime

- `staleTime` is for re-fetching
- Cache is for data that might be re-used later
  - query goes into "cold storage" if there's no active `useQuery`
  - cache data expires after `cacheTime` (default: five minutes)
    - how long it's been since the last active `useQuery`
  - after the cache expires, the data is garbage collected
- Cache is backup data to display while fetching

### 14. Pre-fetching Data

- Prefetch
  - adds data to cache
  - automatically stale (configurable)
  - shows while re-fetching
    - as long as cache hasn't expired!
- Prefetching can be used for any anticipated data needs
  - not just pagination!

[Doc: React query - Prefetch](https://tanstack.com/query/v4/docs/guides/prefetching)
[Doc: React query v3 - Prefetch](https://react-query-v3.tanstack.com/guides/prefetching)

### 16. Intro to Mutations

- Similar to useQuery, but:
  - return _mutate_ function
  - doesn't need query key
  - isLoading but no isFetching
  - by default, re retries (configurable!)

[Doc: React query - Mutations](https://tanstack.com/query/v4/docs/guides/mutations)
[Doc: React query v3 - Mutations](https://react-query-v3.tanstack.com/guides/mutations)

### 19. Summary: React Query Basics

- install package, create `QueryClient` and `QueryProvider`
- `useQuery`, `isLoading`, `isFetching`
- `staleTime`: for whether or not to re-fetch (on trigger)
- `cacheTime`: for how long to hold on to data after inactivity
- query key
- pagination and pre-fetching
- `useMutation`

</details>

> Use react-query v3 for the first project \
> and then move on to v4 from the second project \
> to see what has changed
