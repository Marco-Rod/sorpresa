import {
  createBrowserRouter,
} from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { HomePage } from "../pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "memories",
        lazy: async () => {
          const { MemoriesPage } = await import("../pages/MemoriesPage");
          return { Component: MemoriesPage };
        },
      },
      {
        path: "memories/2026",
        lazy: async () => {
          const { Memory2026Page } = await import("../pages/Memory2026Page");
          return { Component: Memory2026Page };
        },
      },
    ],
  },
]);
