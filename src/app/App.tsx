import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/app/AuthContext';
import { AuthenticatedLayout } from '@/app/AuthenticatedLayout';
import { ProtectedRoute } from '@/app/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SignupConfirmPage } from '@/features/auth/pages/SignupConfirmPage';
import { SignupPage } from '@/features/auth/pages/SignupPage';
import { SignupDraftProvider } from '@/features/auth/context/SignupDraftContext';
import { OnboardingWizard } from '@/features/onboarding/OnboardingWizard';
import { JobsPage } from '@/features/jobs/pages/JobsPage';
import { JobDetailPage } from '@/features/jobs/pages/JobDetailPage';
import { SettingsPage } from '@/features/autoApply/pages/SettingsPage';
import { QueuePage } from '@/features/autoApply/pages/QueuePage';
import { TrackerPage } from '@/features/tracker/pages/TrackerPage';

export default function App() {
  return (
    <AuthProvider>
      <SignupDraftProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/confirm" element={<SignupConfirmPage />} />
          <Route element={<ProtectedRoute allowIncompleteProfile />}>
            <Route path="/onboarding" element={<OnboardingWizard />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/tracker" element={<TrackerPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/queue" element={<QueuePage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SignupDraftProvider>
    </AuthProvider>
  );
}
