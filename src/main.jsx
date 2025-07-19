import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import mainRoutes from "./Routers/mainRoutes";
import "./index.css";
import AuthProvider from "./providers/AuthProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Import TanStack Query core
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// Create a client instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={mainRoutes} />
        <ToastContainer position="top-center" autoClose={3000} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

