import React from 'react';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Outlet} from "react-router-dom";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} />
        <Outlet />
      </QueryClientProvider>
    );
};

export default App;