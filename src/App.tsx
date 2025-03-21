import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AccountContextProvider } from "./context/AccountContext";
import Header from "@/components/common/Header";
import StatusBar from "@/components/common/StatusBar";

const queryClient = new QueryClient();

function App() {
  return (
    <main className="flex flex-col h-screen">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} />
        <AccountContextProvider>
          <StatusBar />
          <Header />
          <Outlet />
        </AccountContextProvider>
      </QueryClientProvider>
    </main>
  );
}

export default App;
