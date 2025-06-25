import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to='/login' />;
};

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  return user ? <Navigate to='/dashboard' /> : <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <Toaster
            position='top-right'
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <Routes>
            <Route
              path='/login'
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path='/register'
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path='/book/:linkId' element={<BookingPage />} />
            <Route path='/' element={<Navigate to='/dashboard' />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
