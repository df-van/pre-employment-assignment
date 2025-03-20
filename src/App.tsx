import React from 'react';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Outlet} from "react-router-dom";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {AccountContextProvider} from "./context/AccountContext";

const queryClient = new QueryClient();
function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} />
        <AccountContextProvider>
        <Outlet />
        </AccountContextProvider>
      </QueryClientProvider>
    );
};

export default App;