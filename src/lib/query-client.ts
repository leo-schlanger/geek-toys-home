import { QueryClient } from '@tanstack/react-query'

/** The app's single client: main.tsx seeds it before the first render. */
export const queryClient = new QueryClient()
