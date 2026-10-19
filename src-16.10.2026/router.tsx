import { QueryClient } from "@tanstack/react-query";
import { createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const basepath = import.meta.env.BASE_URL;

export function createAppRouter() {
  const queryClient = new QueryClient();
  // 2. Створіть хеш-історію
  // const hashHistory = createHashHistory();

  const router = createRouter({
    routeTree,
    basepath,
    // history: hashHistory, // <--- 3. Передайте її сюди
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
