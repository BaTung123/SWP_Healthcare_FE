import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";
import AdminPage from "../pages/admin/adminPage";
import MemberPage from "../pages/member/memberPage";

// Lazy load components
const HomePage = lazy(() => import("../pages/guest/homePage"));
const AboutPage = lazy(() => import("../pages/guest/aboutPage"));
const BloodDonateEventPage = lazy(() => import("../pages/guest/bloodDonateEventPage"));
const ContactPage = lazy(() => import("../pages/guest/contactPage"));
const NewsPage = lazy(() => import("../pages/guest/newsPage"));
const BlogDetailPage = lazy(() => import("../pages/guest/blogDetailPage"));
const BloodSearchPage = lazy(() => import("../pages/guest/bloodSearchPage"));
const LoginPage = lazy(() => import("../pages/guest/loginPage"));
const RegisterPage = lazy(() => import("../pages/guest/registerPage"));
const BloodDonationHistoryPage = lazy(() => import("../pages/guest/bloodDonationHistoryPage"));
const VerifyOTP = lazy(() => import("../pages/guest/verifyOTP"));

// Member routes
const ProfilePage = lazy(() => import("../pages/member/profilePage"));
const DonationRegisterPage = lazy(() => import("../pages/member/donationRegisterPage"));
//const DonationHistoryPage = lazy(() => import("../pages/member/donationHistoryPage"));
const RecoveryReminderPage = lazy(() => import("../pages/member/recoveryReminderPage"));

// Staff routes
const RequesterDonorPage = lazy(() => import("../pages/staff/requesterDonorPage"));
const ReceiverPage = lazy(() => import("../pages/staff/receiverPage"));
const BloodStockManagementPage = lazy(() => import("../pages/staff/bloodStockManagementPage"));
const DonationProcessPage = lazy(() => import("../pages/staff/donationProcessPage"));
const BloodRequestPage = lazy(() => import("../pages/staff/bloodRequestPage"));
const EventManagementPage = lazy(() => import("../pages/staff/eventManagementPage"));
const BloodDropPage = lazy(() => import("../pages/staff/bloodDropPage"));
const SendBloodPage = lazy(() => import("../pages/staff/sendBloodPage"));

// Admin routes
const AdminDashboardPage = lazy(() => import("../pages/admin/adminDashboardPage"));
const UserManagementPage = lazy(() => import("../pages/admin/userManagementPage"));
const BlogManagementPage = lazy(() => import("../pages/admin/blogManagementPage"));

// Loading component
const Loading = () => <div>Loading...</div>;

// Route protection wrapper
const ProtectedRoute = ({ children, roles }) => {
  // Add your authentication logic here
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export const router = createBrowserRouter([
  // Guest routes
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { 
        path: "", 
        element: <Suspense fallback={<Loading />}><HomePage /></Suspense>
      },
      { 
        path: "/about", 
        element: <Suspense fallback={<Loading />}><AboutPage /></Suspense>
      },
      { 
        path: "/event", 
        element: <Suspense fallback={<Loading />}><BloodDonateEventPage /></Suspense>
      },
      { 
        path: "/contact", 
        element: <Suspense fallback={<Loading />}><ContactPage /></Suspense>
      },
      { 
        path: "/news", 
        element: <Suspense fallback={<Loading />}><NewsPage /></Suspense>
      },
      { 
        path: "/blog/:id", 
        element: <Suspense fallback={<Loading />}><BlogDetailPage /></Suspense>
      },
      { 
        path: "/blood-search", 
        element: <Suspense fallback={<Loading />}><BloodSearchPage /></Suspense>
      },
      { 
        path: "/blood-history", 
        element: <Suspense fallback={<Loading />}><BloodDonationHistoryPage /></Suspense>
      },
      { 
        path: "/member/profile", 
        element: <ProtectedRoute roles={["member"]}><ProfilePage /></ProtectedRoute>
      },
      { 
        path: "/member/register-donation", 
        element: <ProtectedRoute roles={["member"]}><DonationRegisterPage /></ProtectedRoute>
      },
    ],
  },

  // Auth routes
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { 
        path: "/login", 
        element: <Suspense fallback={<Loading />}><LoginPage /></Suspense>
      },
      { 
        path: "/register", 
        element: <Suspense fallback={<Loading />}><RegisterPage /></Suspense>
      },
      { 
        path: "/verify-otp", 
        element: <Suspense fallback={<Loading />}><VerifyOTP /></Suspense>
      },
    ],
  },

  // Member routes
  {
    path: "/member",
    element: <MemberPage />,
    children: [
      //{ 
        //path: "donation-history", 
        //element: <ProtectedRoute roles={["member"]}><DonationHistoryPage /></ProtectedRoute>
      //},
      { 
        path: "recovery-reminder", 
        element: <ProtectedRoute roles={["member"]}><RecoveryReminderPage /></ProtectedRoute>
      },
    ],
  },

  // Staff routes
  {
    path: "/staff",
    element: <AdminPage />,
    children: [
      { 
        path: "donor", 
        element: <ProtectedRoute roles={["staff"]}><RequesterDonorPage /></ProtectedRoute>
      },
      { 
        path: "receiver", 
        element: <ProtectedRoute roles={["staff"]}><ReceiverPage /></ProtectedRoute>
      },
      { 
        path: "blood-stock", 
        element: <ProtectedRoute roles={["staff"]}><BloodStockManagementPage /></ProtectedRoute>
      },
      { 
        path: "donation-process", 
        element: <ProtectedRoute roles={["staff"]}><DonationProcessPage /></ProtectedRoute>
      },
        { 
          path: "blood-request", 
          element: <ProtectedRoute roles={["staff"]}><BloodRequestPage /></ProtectedRoute>
        },
      { 
        path: "event", 
        element: <ProtectedRoute roles={["staff"]}><EventManagementPage /></ProtectedRoute>
      },
      { 
        path: "blood-drop", 
        element: <ProtectedRoute roles={["staff"]}><BloodDropPage /></ProtectedRoute>
      },
      { 
        path: "send-blood", 
        element: <ProtectedRoute roles={["staff"]}><SendBloodPage /></ProtectedRoute>
      },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <AdminPage />,
    children: [
      { 
        path: "", 
        element: <ProtectedRoute roles={["admin"]}><AdminDashboardPage /></ProtectedRoute>
      },
      { 
        path: "user", 
        element: <ProtectedRoute roles={["admin"]}><UserManagementPage /></ProtectedRoute>
      },
      { 
        path: "blog", 
        element: <ProtectedRoute roles={["admin"]}><BlogManagementPage /></ProtectedRoute>
      },
    ],
  },
]);