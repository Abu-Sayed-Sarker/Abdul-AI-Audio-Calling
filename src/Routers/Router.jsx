import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layouts/Dashboard";
import App from "../Pages/Room";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <h1>404</h1>,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },
  {
    path: "/register",
    element: <h1>Register</h1>,
  },
]);
