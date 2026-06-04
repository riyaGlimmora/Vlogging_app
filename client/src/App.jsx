import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSkeleton from './components/LoadingSkeleton';

const Home = lazy(() => import('./pages/Home'));
const VlogDetail = lazy(() => import('./pages/VlogDetail'));
const CreateVlog = lazy(() => import('./pages/CreateVlog'));
const EditVlog = lazy(() => import('./pages/EditVlog'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const PageLoader = () => (
  <div className="py-8">
    <LoadingSkeleton count={3} />
  </div>
);

function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vlogs/:id" element={<VlogDetail />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateVlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditVlog />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
