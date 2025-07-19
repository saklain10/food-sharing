import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AvailableFoods from "../pages/AvailableFoods";
import AddFood from "../pages/AddFood";
import ManageFoods from "../pages/ManageFoods";
import MyRequests from "../pages/MyRequests";
import FoodDetails from "../pages/FoodDetails";
import PrivateRoute from "../Routers/PrivateRoute.jsx";

const mainRoutes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/registration",
        element: <Register />,
      },
      {
        path: "/available-foods",
        element: <AvailableFoods />,
      },
      {
        path: "/food/:id",
        element: (
          <PrivateRoute>
            <FoodDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-food",
        element: (
          <PrivateRoute>
            <AddFood />
          </PrivateRoute>
        ),
      },
      {
        path: "/manage-foods",
        element: (
          <PrivateRoute>
            <ManageFoods />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-requests",
        element: (
          <PrivateRoute>
            <MyRequests />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default mainRoutes;
