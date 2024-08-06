import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Signup from "./views/Signup";
import Surveys from "./views/Surveys";
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";
import SurveyView from "./views/SurveyView";
import SurveyPulicView from "./views/SurveyPulicView";
import UiDashboard from "./components/UI-collection/UiDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Surveys />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/surveys/create",
        element: <SurveyView />,
      },
      {
        path: "/surveys/:id",
        element: <SurveyView />,
      },
    ],
  },
  {
    path: "/guest",
    element: <GuestLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/survey/get-by-slug/:slug",
    element: <SurveyPulicView />,
  },
  {
    path: "/test",
    element: <UiDashboard />,
  },
]);
export default router;
