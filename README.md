# React Query / TanStack Query: React Server State Management

React Query / TanStack Query: React Server State Management by Bonnie Schulkin

## Folder structure

- 01-queries-loading-error
  - blog-em-ipsum: react-query v3
- 03-infinite-queries
  - infinite-swapi: react-query v4
- from 04-central-custom-hook
  - lazy-spa
    - large app
    - server and client
    - typescript
    - jwt authentication
    - react-query v4

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

## Section 03. Infinite Queries for Loading Data "Just in Time"

### 21. Code Quiz! Set up Infinite SWAPI for React Query

```sh
npm install --legacy-peer-deps
npm install --save @tanstack/react-query
npm install --save @tanstack/react-query-devtools
```

### 22. Intro to useInfiniteQuery

- Shape of `data` different than `useQuery`
- Object with two properties:
  - pages
  - pageParams
- Every query has its own element in the `pages` array
- `pageParams` tracks the keys of queries that have been retrieved
  - rarely used, won't use here

### 24. Write useInfiniteQuery Call

[npm react-infinite-scroller](https://www.npmjs.com/package/react-infinite-scroller)

> there's other libraries as well, \
> but Bonnie think this library really works well with react-query infinite query

## Section 04. React Query in Larger App: Setup, Centralization, Custom Hooks

### 29. Intro to Lazy Days Spa App

Create `.env` file and add `EXPRESS_SECRET`

- centralizing fetching indicator / error handling
- refetching data
- integrating with auth
- dependent queries
- testing

### 31. Lazy Days Spa App Code Orientation

If you want to ignore TypeScript?

- `// @ts-nocheck` at the top of the problem file, or
- `// @ts-ignore` above the problem line

```sh
npm install
npm install --save @tanstack/react-query
npm install --save @tanstack/react-query-devtools

npx browserslist@latest --update-db
```

### 36. Centralized Fetching indicator with useIsFetching

- in smaller apps
  - used `isFetching` from useQuery return object
- in a larger app
  - Loading spinner whenever any query `isFetching`
  - `useIsFetching` tells us this!
- No need for `isFetching` on every custom hook / `useQuery` call

### 37. onError Handler for useQuery

[Chakra UI - Toast](https://chakra-ui.com/docs/components/toast)

> You will see 3 http requests on the network tab in the inspector
> As default, react-query tries 3 times before gives up and to decide that is an error

### 39. onError Default for Query Client

https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts

```js
export interface DefaultOptions<TError = unknown> {
  queries?: QueryObserverOptions<unknown, TError>
  mutations?: MutationObserverOptions<unknown, TError, unknown, unknown>
}
```

#### Alternative to `onError`: `Error Boundary`

- Alternative: handle errors with React Error Boundary
  - https://reactjs.org/docs/error-boundaries.html
- `useErrorBoundary` for `useQuery`
  - reference: https://tanstack.com/query/v4/docs/reference/useQuery
- option to `useQuery` / `useMutation`
  - or in `defaultOptions` when creating QueryClient
- Set to true to propagate erros to the nearest error boudnary

### 38. UPDATE: alternative way to specify global error handler

[TKDODO's blog about react-query-error-handling: https://tkdodo.eu/blog/react-query-error-handling#the-global-callbacks](https://tkdodo.eu/blog/react-query-error-handling#the-global-callbacks)

> **Why is this way better?** \
> Because the handler is tied to the query cache -- instead of the individual query -- the error handler is only triggered after all retries have failed. In the code presented in the course, the `toast.closeAll()` helps clean up any toasts triggered from previous retries. Using the `queryCache` option prevents toasts from retries, so `toast.closeAll()` (which is pretty inelegant) is not required.

> **Any other differences I should know about?** \
> If you set the global error callback via `defaultOptions` (as presented in the lecture), **you can override the error callback in the `useQuery` options**. However, if you set the callback in the `queryCache` options (as presented in this article), and then set a different callback in the `useQuery` options, then both error callbacks will run on error (see this Q&A thread for a demonstration).

## Section 05. Query Features I: Pre-Fetching and Pagination

### 42. Adding Data to the Cache

|                 | where to use?           | data from? | added to cache? |
| --------------- | ----------------------- | ---------- | --------------- |
| prefetchQuery   | method to `queryClient` | server     | yes             |
| setQueryData    | method to `queryClient` | client     | yes             |
| placeholderData | method to `useQuery`    | client     | no              |
| initialData     | method to `useQuery`    | client     | yes             |

### 49. Summary: Query Features I

- Pre-populating data option: refer to the table above
- Pre-fetch to pre-populate cache
  - on component render
  - on page(month/year) update
  - `keepPreviousData` only useful if background doesn't change
- Treat keys as dependency arrays

## Section 06. Query Features II: Transforming and Re-Fetching Data

### 50. Filtering Data with the useQuery select Option

Filtering with the `select` option

Reference: [Dominik's (tkdodo) Blog - Data Transformation: https://tkdodo.eu/blog/react-query-data-transformations](https://tkdodo.eu/blog/react-query-data-transformations)

### 52. Intro to Re-Fetch

- Re-fetch ensures stale data gets updated from server
  - Seen when we leave the page and refocus
- Stale queries are re-fetched automatically in the background when:
  - New instances of the query mount
  - Every time a react component (that has a useQuery call) mounts
  - The window is refocused
  - The network is reconnected
  - configured `refetchInterval` has expired
    - Automatic polling

#### Re-fetching! How?

- Control with global or query-specific options:
  - `refetchOnMount`, `refetchOnWindowFocus`, `refetchOnReconnect, refetchInterval`
- Or, imperatively: `refetch` function in `useQuery` return object
- reference: https://tanstack.com/query/v4/docs/guides/important-defaults

#### Suppressing Re-Fetch

- How?
  - Increase stale time
  - turn off refetchOnMount / refetchOnWindowFocus / refetchOnReconnect
- Only for very rarely changed, not mission-critical data

  - treatments or staff (definitely not appointments!)

- Ask: is it worth it?

### 56. Polling: Auto Re-Fetching at an Interval

- `refetchInterval` option to `useQuery`
  - Reference: https://tanstack.com/query/v4/docs/examples/react/auto-refetching
- what about `userAppointments`?
  - can this go with the defaults?
  - Yes, becuase it will never be updated "from underneath us"

#### differences

- `useAppointments`
  - all users
  - only for display month
- `useUserAppointments`
  - only logged-in user
  - all time

## Section 07. React Query and Authentication

### 58. Intro to React Query and Authentication

- Who should "own" the user data, `useAuth` or `useQuery`?
  - Should `useAuth` call `useQuery`, or make the axios calls directly?
  - Should `useAuth` have a provider that stores data, or store user data in React Query cache?

#### Separation of Concerns

- React Query: provide cache for **server state** on the client
- `useAuth`: provides functions for signin/signup/signout
- Conclusion: React Query will store data (via `useUser`)
- `useAuth` collects user data from calls to server (add to cache)

#### Role of `useUser`

- Returns `user` data from React Query
  - Load from `localStorage` on initialization
- keep user data up to date with server via `useQuery`
  - query function returns `null` if no user logged in
  - update React Query cache via `setQueryData`
  - update `localStorage` in `onSuccess` callback
  - `onSuccess` runs after:
    - `setQueryData` [from v4, it's not!](https://tanstack.com/query/v4/docs/guides/migrating-to-react-query-4#onsuccess-is-no-longer-called-from-setquerydata)
    - query function

### 60. Integrate Auth with React Query

- React Query acting as a provider for auth
- Use `queryClient.setQueryData`
- Add to `updateUser` and `clearUser`
  - `useAuth`already calls these functions

### 61. Persist User Data in localStorage

- Returns `user` data from React Query
  - Load from `localStorage` on initialization
- keep user data up to date with server via `useQuery`
  - update `localStorage` in `onSuccess` callback
  - `onSuccess` runs after:
    - `setQueryData` [from v4, it's not!](https://tanstack.com/query/v4/docs/guides/migrating-to-react-query-4#onsuccess-is-no-longer-called-from-setquerydata)
    - query function

### 62. initialData from localStorage for useQuery

- Use `initialData` value to `useQuery`
  - For use when you want to initial value to be added to the cache
  - For placeholder, use `placeholderData` or default destructured value
- Reference: https://tanstack.com/query/v4/docs/guides/initial-query-data

### 63. Dependent Queries: userAppointments

Reference: https://tanstack.com/query/v4/docs/guides/dependent-queries

> There are many `useUser` is used so there are 6 observers in a page \
> but react-query is smart enough to deduplicate http requests!

## Section 08. Mutations: Using React Query to Update Data on the Server

### 66. Introduction to Mutations and Mutations Global Settings

#### Global fetching / Error

- Very similar to queries
- Errors
- Loading indicator
  - `useIsMutating` is analogous to `useIsFetching`
  - Update `Loading` component to show on `isMutating`

### 67. Custom Mutation Hook: useReserveAppointments

reference:

- https://tanstack.com/query/v4/docs/guides/mutations
- https://tanstack.com/query/v4/docs/reference/useMutation

### 69. Invalidating Query after Mutation

- https://tanstack.com/query/v4/docs/guides/query-invalidation

### 70. Query Key Prefixes

- `invalidateQueries` takes a query key prefix
  - invalidate all realted queries at once
  - can make it exact with `{ exact: true }` option
  - other queryClient methods take prefix too (like `removeQueries`)
- references
  - https://tanstack.com/query/v4/docs/guides/query-keys
  - https://tanstack.com/query/v4/docs/guides/query-invalidation#query-matching-with-invalidatequeries

### 72. Update User and Query Cache with Mutation Response

reference: https://tanstack.com/query/v4/docs/guides/updates-from-mutation-responses

### 73. Intro to Optimistic Updates in React Query

- Optimistic updates
  - reference: https://tanstack.com/query/v4/docs/guides/optimistic-updates
- Makeing query "Cancel-able"
  - reference: https://tanstack.com/query/v4/docs/guides/query-cancellation

### 74. Making a Query "Cancel-able"

Manually Cancelling Query

- React Query uses `AbortController` to cancel queries
  - standard JavaScript interface, send `AbortSignal` to DOM request
  - https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- Automatically canceled queries use this signal "behind the scenes"
  - out-of-date or inactive queries
- Manually canceled axios query
  - pass `signal` to axis via argument to query function
  - https://axios-http.com/docs/cancellation
- reference: https://tanstack.com/query/v4/docs/guides/query-cancellation

#### Abirting via signal

- useQuery(queryKeys.user) -> AbortController -> getUser -> axis
- queryClient.cancelQuery(queryKeys.user) -> AbortController

## Section 09. Testing React Query

### 77. Intro to Testing React Query

- Material in this section is adapted from fantastic blog post
  - https://tkdodo.eu/blog/testing-react-query
- references: https://tanstack.com/query/v4/docs/guides/testing

### 78. Testing Setup, including Mock Service Worker

- `npm install msw`
- if not create-react-app, `npm install @testing-library/react`
- MSW setup is already in src/mocks and src/setupTests.js
  - All boilerplate from docs
  - https://mswjs.io/docs/getting-started
  - https://mswjs.io/docs/getting-started/integrate/node#using-create-react-app

### 79. Query Client and Provider in Tests

- reference: https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
- Wrap for every test? Make a custom testing library render function
  - https://testing-library.com/docs/react-testing-library/setup/#custom-render

### 82. Testing Query Errors

- [v4 - Custom logger](https://tanstack.com/query/v4/docs/guides/custom-logger)
  - But it has been deprecated and will be removed in the next major version.
  - Logging only has an effect in development mode, where passing a custom logger is not necessary.
- [v3 - setLogger](https://react-query-v3.tanstack.com/reference/setLogger)

### 84. Testing Mutations

- Mutations are harder
  - MSW doesn't mimic a dynamic server (can't change responses based on state)
  - To test results of mutation, need to have a test server, not just MSW
  - Outside the scope of this course
- Instead, check for toast on success
- Close toast at the end of the test
  - Keep toast state clean (so it doens't bleed into other tests), and
  - Make sure toast disappearance doesn't happen after test finishes and make jest angry
  - `waitForElementToBeRemoved` from `'@testing-library/react'`

#### MemoryRouter

- `Calendar` component includes React Router `Link`
- `Link` can't be used outside of Router provider
- `MemoryRouter` is generally used for tests
- A `<Router>` that keeps the history of your ???URL??? in memory (does not read or write to the address bar). Useful in **tests** and non-browser environments like **React Native**.
- references
  - [MemoryRouter - React Router v6](https://reactrouter.com/en/main/router-components/memory-router)
  - [MemoryRouter - React Router v5](https://v5.reactrouter.com/web/api/MemoryRouter)

#### Mocking User Login

- Need logged in user to be able to reserver appointment!
- Mimic this by mocking return value from `useUser`

### 86. Intro to Testing Custom Hooks

```sh
npm install @testing-library/react-hooks
```

[GitHub @testing-library/react-hook](https://github.com/testing-library/react-hooks-testing-library)

#### When not to use this library

- Your hook is defined alongside a component and is only used there
- Your hook is easy to test by just testing the components using it

reference - [Dominik's Blog - For custom hook](https://tkdodo.eu/blog/testing-react-query#for-custom-hooks)

</details>
