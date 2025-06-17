import React from "react";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Dashboard from "./components/dashboard";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store";
import NonLegalServices from "./pages/home-page/services/non-legalDNA/NonLegalDNA";
import OverviewPage from "./pages/dashboard-admin/overview";
import ServicesOverview from "./pages/home-page/services";
import LegalServices from "./pages/home-page/services/legalDNA/LegalDNA";
import HomeContent from "./components/home-content/HomeContent";
import Guide from "./pages/home-page/guide";
import Pricing from "./pages/home-page/pricing";
import Blog from "./pages/home-page/blog";
import VerifyPage from "./components/verify-otp/VerifyPage";
import ServiceManagement from "./pages/dashboard-admin/service-management";
import AccountManagement from "./pages/dashboard-admin/account-management";
import ContentManagement from "./pages/dashboard-admin/content-managment";
import Inventory from "./pages/dashboard-admin/inventory";
import SystemLogs from "./pages/dashboard-admin/system-logs";
import Booking from "./pages/dashboard-admin/services/Booking";
import ServiceManagementPage from "./pages/dashboard-admin/services/ServiceManagement";
import Contact from "./pages/home-page/contact";
import ScrollToTopButton from "./components/hooks/useScrollToTop"; // Sửa import thành component chính xác

// ScrollToTop component cho router
const ScrollToTop = () => {
  // Thêm hook để scroll to top khi chuyển trang
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

// Root Layout component
const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <ScrollToTopButton /> {/* Thêm nút ScrollToTop vào đây */}
      <Outlet />
    </>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
          children: [
            {
              index: true,
              element: <HomeContent />,
            },
            {
              path: "services",
              element: <ServicesOverview />,
            },
            {
              path: "services/legal",
              element: <LegalServices />,
            },
            {
              path: "services/non-legal",
              element: <NonLegalServices />,
            },
            {
              path: "guide",
              element: <Guide />,
            },
            {
              path: "pricing",
              element: <Pricing />,
            },
            {
              path: "blog",
              element: <Blog />,
            },
            {
              path: "contact",
              element: <Contact />,
            },
          ],
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
          children: [
            {
              path: "overview",
              element: <OverviewPage />,
            },
            {
              path: "services",
              children: [
                { path: "booking", element: <Booking /> },
                { path: "service-management", element: <ServiceManagementPage /> },
                { index: true, element: <ServiceManagementPage /> },
              ],
            },
            {
              path: "accounts",
              element: <AccountManagement />,
            },
            {
              path: "blog",
              element: <ContentManagement />,
            },
            {
              path: "inventory",
              element: <Inventory />,
            },
            {
              path: "logs",
              element: <SystemLogs />,
            },
          ],
        },
        {
          path: "/verify",
          element: <VerifyPage />,
        },
      ],
    },
  ]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;