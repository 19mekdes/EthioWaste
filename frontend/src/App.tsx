import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public Pages
import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Citizen Pages
import { CitizenOverviewPage } from './pages/citizen/CitizenOverviewPage';
import { ReportWastePage } from './pages/citizen/ReportWastePage';
import { MyReportsPage } from './pages/citizen/MyReportsPage';
import { CollectionRequestPage } from './pages/citizen/CollectionRequestPage';
import { MyRequestsPage } from './pages/citizen/MyRequestsPage';
import { RequestDetailPage } from './pages/citizen/RequestDetailPage';
import { NotificationsPage } from './pages/citizen/NotificationsPage';
import { ComplaintsPage } from './pages/citizen/ComplaintsPage';
import { FeedbackPage } from './pages/citizen/FeedbackPage';
import { CentersPage } from './pages/citizen/CentersPage';
import { RewardsPage } from './pages/citizen/RewardsPage';

// Collector Pages
import { CollectorOverviewPage } from './pages/collector/CollectorOverviewPage';
import { CollectorTasksPage } from './pages/collector/CollectorTasksPage';
import { CollectorTaskDetailPage } from './pages/collector/CollectorTaskDetailPage';
import { CollectorHistoryPage } from './pages/collector/CollectorHistoryPage';
import { CollectorNotificationsPage } from './pages/collector/CollectorNotificationsPage';
import { CollectorProfilePage } from './pages/collector/CollectorProfilePage';

// Recycling Pages
import { RecyclingOverviewPage } from './pages/recycling/RecyclingOverviewPage';
import { RecyclingMaterialsPage } from './pages/recycling/RecyclingMaterialsPage';
import { RecyclingRecordsPage } from './pages/recycling/RecyclingRecordsPage';
import { RecyclingRecordDetailPage } from './pages/recycling/RecyclingRecordDetailPage';
import { RecyclingHistoryPage } from './pages/recycling/RecyclingHistoryPage';
import { RecyclingNotificationsPage } from './pages/recycling/RecyclingNotificationsPage';
import { RecyclingProfilePage } from './pages/recycling/RecyclingProfilePage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminRequestsPage } from './pages/admin/AdminRequestsPage';
import { AdminTasksPage } from './pages/admin/AdminTasksPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCollectorsPage } from './pages/admin/AdminCollectorsPage';
import { AdminRecyclingOrgsPage } from './pages/admin/AdminRecyclingOrgsPage';
import { AdminCentersPage } from './pages/admin/AdminCentersPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminFeedbackPage } from './pages/admin/AdminFeedbackPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    switch (user.role) {
      case 'CITIZEN':
        return <Navigate to="/citizen/overview" replace />;
      case 'COLLECTOR':
        return <Navigate to="/collector/overview" replace />;
      case 'RECYCLING_ORGANIZATION':
        return <Navigate to="/recycling/overview" replace />;
      case 'MUNICIPAL_ADMIN':
        return <Navigate to="/admin/overview" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Citizen Routes */}
          <Route
            path="/citizen/overview"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CitizenOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/report-waste"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <ReportWastePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/my-reports"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <MyReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/request-collection"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CollectionRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/my-requests"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <MyRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/requests/:id"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <RequestDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/notifications"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/complaints"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <ComplaintsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/feedback"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <FeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/centers"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CentersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/rewards"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <RewardsPage />
              </ProtectedRoute>
            }
          />

          {/* Collector Routes */}
          <Route
            path="/collector/overview"
            element={
              <ProtectedRoute allowedRoles={['COLLECTOR']}>
                <CollectorOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collector/tasks"
            element={
              <ProtectedRoute allowedRoles={['COLLECTOR']}>
                <CollectorTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collector/tasks/:id"
            element={
              <ProtectedRoute allowedRoles={['COLLECTOR']}>
                <CollectorTaskDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collector/history"
            element={
              <ProtectedRoute allowedRoles={['COLLECTOR']}>
                <CollectorHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collector/notifications"
            element={
              <ProtectedRoute allowedRoles={['COLLECTOR']}>
                <CollectorNotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collector/profile"
            element={
              <ProtectedRoute allowedRoles={['COLLECTOR']}>
                <CollectorProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Recycling Organization Routes */}
          <Route
            path="/recycling/overview"
            element={
              <ProtectedRoute allowedRoles={['RECYCLING_ORGANIZATION']}>
                <RecyclingOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycling/materials"
            element={
              <ProtectedRoute allowedRoles={['RECYCLING_ORGANIZATION']}>
                <RecyclingMaterialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycling/records"
            element={
              <ProtectedRoute allowedRoles={['RECYCLING_ORGANIZATION']}>
                <RecyclingRecordsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycling/records/:id"
            element={
              <ProtectedRoute allowedRoles={['RECYCLING_ORGANIZATION']}>
                <RecyclingRecordDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycling/history"
            element={
              <ProtectedRoute allowedRoles={['RECYCLING_ORGANIZATION']}>
                <RecyclingHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycling/notifications"
            element={
              <ProtectedRoute allowedRoles={['RECYCLING_ORGANIZATION']}>
                <RecyclingNotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycling/profile"
            element={
              <ProtectedRoute allowedRoles={['RECYCLING_ORGANIZATION']}>
                <RecyclingProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Municipal Admin Routes */}
          <Route
            path="/admin/overview"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tasks"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/collectors"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminCollectorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/recycling-orgs"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminRecyclingOrgsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/centers"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminCentersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminComplaintsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminFeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['MUNICIPAL_ADMIN']}>
                <AdminAnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
