import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ErrorBoundary from "./pages/errors/ErrorBoundary";
import Home from "./pages/home";
import Accounts from "./pages/accounts";
import Transfer from "./pages/transfer";
import InputAmount from "./pages/transfer/InputAmount";
import TransferProcess from "./pages/transfer/TransferProcess";
import TransferComplete from "./pages/transfer/TransferComplete";
import TransferFailed from "./pages/transfer/TransferFailed";
import NotFound from "./pages/errors/NotFound";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorBoundary/>,
    children: [
      {index: true, element: <Home/>},
      {
        path: "/accounts",
        element: <Accounts/>,
      },
      {
        path: "/transfer",
        element: <Transfer/>,
        children: [
          {index: true, element: <Navigate to="/transfer/input-amount" replace/>},
          {index: true, path: 'input-amount', element: <InputAmount/>},
          {path: 'process', element: <TransferProcess/>},
          {path: 'complete', element: <TransferComplete/>},
          {path: 'failed', element: <TransferFailed/>}
        ]
      },
      {path: "*", element: <NotFound/>}
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);