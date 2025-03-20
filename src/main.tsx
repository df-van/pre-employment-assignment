import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorBoundary from "./pages/errors/ErrorBoundary";
import Home from "./pages/home";
import Accounts from "./pages/accounts";
import Transfer from "./pages/transfer";
import InputAmount from "./pages/transfer/InputAmount";
import TransferComplete from "./pages/transfer/TransferComplete";
import TransferFailed from "./pages/transfer/TransferFailed";
import NotFound from "./pages/errors/NotFound";
import { PATH } from "./config";

const router = createBrowserRouter([
  {
    path: PATH.HOME,
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      {
        path: PATH.ACCOUNTS,
        element: <Accounts />,
      },
      {
        path: PATH.TRANSFER,
        element: <Transfer />,
        children: [
          {
            index: true,
            element: <Navigate to={PATH.TRANSFER_INPUT_AMOUNT} replace />,
          },
          {
            index: true,
            path: PATH.TRANSFER_INPUT_AMOUNT,
            element: <InputAmount />,
          },
          { path: PATH.TRANSFER_COMPLETE, element: <TransferComplete /> },
          { path: PATH.TRANSFER_FAILED, element: <TransferFailed /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
